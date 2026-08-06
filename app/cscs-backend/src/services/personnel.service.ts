import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import {
  Personnel,
  PersonnelAssignmentWithLocation,
  CreatePersonnelInput,
  UpdatePersonnelInput,
  CreatePersonnelAssignmentInput,
  UpdatePersonnelAssignmentInput,
} from '../types/personnel.types';
import { NotFoundError, ConflictError } from '../utils/AppError';

interface MysqlError extends Error {
  code?: string;
}

export async function getAllPersonnel(): Promise<Personnel[]> {
  const [rows] = await pool.query<(Personnel & RowDataPacket)[]>(
    'SELECT * FROM Personnel ORDER BY last_name, first_name',
  );
  return rows;
}

export async function getPersonnelById(id: number): Promise<Personnel> {
  const [rows] = await pool.query<(Personnel & RowDataPacket)[]>(
    'SELECT * FROM Personnel WHERE personnel_id = ?',
    [id],
  );
  if (!rows[0]) throw new NotFoundError('Personnel', id);
  return rows[0];
}

export async function createPersonnel(input: CreatePersonnelInput): Promise<Personnel> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Personnel
         (first_name, last_name, date_of_birth, ssn, medicare_number,
          phone_number, address, city, province, postal_code, email, role, mandate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.first_name, input.last_name, input.date_of_birth,
        input.ssn, input.medicare_number ?? null,
        input.phone_number ?? null, input.address ?? null,
        input.city ?? null, input.province ?? null,
        input.postal_code ?? null, input.email ?? null,
        input.role, input.mandate,
      ],
    );
    return getPersonnelById(result.insertId);
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError('A personnel record with that SSN or medicare number already exists');
    }
    throw err;
  }
}

export async function updatePersonnel(id: number, input: UpdatePersonnelInput): Promise<Personnel> {
  await getPersonnelById(id);
  const fields = Object.keys(input) as (keyof UpdatePersonnelInput)[];
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => input[f]);
  try {
    await pool.query<ResultSetHeader>(
      `UPDATE Personnel SET ${setClause} WHERE personnel_id = ?`,
      [...values, id],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError('A personnel record with that SSN or medicare number already exists');
    }
    throw err;
  }
  return getPersonnelById(id);
}

export async function deletePersonnel(id: number): Promise<void> {
  await getPersonnelById(id);
  await pool.query<ResultSetHeader>('DELETE FROM Personnel WHERE personnel_id = ?', [id]);
}

export async function getPersonnelAssignments(
  personnelId: number,
): Promise<PersonnelAssignmentWithLocation[]> {
  await getPersonnelById(personnelId);
  const [rows] = await pool.query<(PersonnelAssignmentWithLocation & RowDataPacket)[]>(
    `SELECT pa.*, l.name AS location_name
     FROM PersonnelAssignment pa
     JOIN Location l ON l.location_id = pa.location_id
     WHERE pa.personnel_id = ?
     ORDER BY pa.start_date DESC`,
    [personnelId],
  );
  return rows;
}

export async function createPersonnelAssignment(
  personnelId: number,
  input: CreatePersonnelAssignmentInput,
): Promise<PersonnelAssignmentWithLocation> {
  await getPersonnelById(personnelId);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO PersonnelAssignment (personnel_id, location_id, start_date, end_date)
       VALUES (?, ?, ?, ?)`,
      [personnelId, input.location_id, input.start_date, input.end_date ?? null],
    );
    const [rows] = await pool.query<(PersonnelAssignmentWithLocation & RowDataPacket)[]>(
      `SELECT pa.*, l.name AS location_name
       FROM PersonnelAssignment pa
       JOIN Location l ON l.location_id = pa.location_id
       WHERE pa.assignment_id = ?`,
      [result.insertId],
    );
    return rows[0];
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        'An assignment for this personnel, location, and start date already exists',
      );
    }
    throw err;
  }
}

export async function updatePersonnelAssignment(
  assignmentId: number,
  input: UpdatePersonnelAssignmentInput,
): Promise<PersonnelAssignmentWithLocation> {
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT assignment_id FROM PersonnelAssignment WHERE assignment_id = ?',
    [assignmentId],
  );
  if (!existing[0]) throw new NotFoundError('PersonnelAssignment', assignmentId);

  const fields = Object.keys(input) as (keyof UpdatePersonnelAssignmentInput)[];
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => input[f]);
  try {
    await pool.query<ResultSetHeader>(
      `UPDATE PersonnelAssignment SET ${setClause} WHERE assignment_id = ?`,
      [...values, assignmentId],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        'An assignment for this personnel, location, and start date already exists',
      );
    }
    throw err;
  }
  const [rows] = await pool.query<(PersonnelAssignmentWithLocation & RowDataPacket)[]>(
    `SELECT pa.*, l.name AS location_name
     FROM PersonnelAssignment pa
     JOIN Location l ON l.location_id = pa.location_id
     WHERE pa.assignment_id = ?`,
    [assignmentId],
  );
  return rows[0];
}

export async function deletePersonnelAssignment(assignmentId: number): Promise<void> {
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT assignment_id FROM PersonnelAssignment WHERE assignment_id = ?',
    [assignmentId],
  );
  if (!existing[0]) throw new NotFoundError('PersonnelAssignment', assignmentId);
  await pool.query<ResultSetHeader>(
    'DELETE FROM PersonnelAssignment WHERE assignment_id = ?',
    [assignmentId],
  );
}
