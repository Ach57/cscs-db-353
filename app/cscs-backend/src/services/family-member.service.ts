import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import {
  FamilyMember,
  FamilyMemberAssignmentWithLocation,
  CreateFamilyMemberInput,
  UpdateFamilyMemberInput,
  CreateFamilyMemberAssignmentInput,
  UpdateFamilyMemberAssignmentInput,
  CreateFamilyMemberAssignmentFlatInput,
} from '../types/family-member.types';
import { NotFoundError, ConflictError } from '../utils/AppError';

interface MysqlError extends Error {
  code?: string;
}

export async function getAllFamilyMembers(): Promise<FamilyMember[]> {
  const [rows] = await pool.query<(FamilyMember & RowDataPacket)[]>(
    'SELECT * FROM FamilyMember ORDER BY last_name, first_name',
  );
  return rows;
}

export async function getFamilyMemberById(id: number): Promise<FamilyMember> {
  const [rows] = await pool.query<(FamilyMember & RowDataPacket)[]>(
    'SELECT * FROM FamilyMember WHERE family_member_id = ?',
    [id],
  );
  if (!rows[0]) throw new NotFoundError('FamilyMember', id);
  return rows[0];
}

export async function createFamilyMember(input: CreateFamilyMemberInput): Promise<FamilyMember> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO FamilyMember
         (first_name, last_name, date_of_birth, ssn, medicare_number,
          phone_number, address, city, province, postal_code, email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.first_name, input.last_name, input.date_of_birth,
        input.ssn, input.medicare_number ?? null,
        input.phone_number ?? null, input.address ?? null,
        input.city ?? null, input.province ?? null,
        input.postal_code ?? null, input.email ?? null,
      ],
    );
    return getFamilyMemberById(result.insertId);
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError('A family member with that SSN or medicare number already exists');
    }
    throw err;
  }
}

export async function updateFamilyMember(
  id: number,
  input: UpdateFamilyMemberInput,
): Promise<FamilyMember> {
  await getFamilyMemberById(id);
  const fields = Object.keys(input) as (keyof UpdateFamilyMemberInput)[];
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => input[f]);
  try {
    await pool.query<ResultSetHeader>(
      `UPDATE FamilyMember SET ${setClause} WHERE family_member_id = ?`,
      [...values, id],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError('A family member with that SSN or medicare number already exists');
    }
    throw err;
  }
  return getFamilyMemberById(id);
}

export async function deleteFamilyMember(id: number): Promise<void> {
  await getFamilyMemberById(id);
  await pool.query<ResultSetHeader>(
    'DELETE FROM FamilyMember WHERE family_member_id = ?',
    [id],
  );
}

export async function getAllFamilyMemberAssignments(): Promise<FamilyMemberAssignmentWithLocation[]> {
  const [rows] = await pool.query<(FamilyMemberAssignmentWithLocation & RowDataPacket)[]>(
    `SELECT fma.*, l.name AS location_name
     FROM FamilyMemberAssignment fma
     JOIN Location l ON l.location_id = fma.location_id
     ORDER BY fma.start_date DESC`,
  );
  return rows;
}

export async function getFamilyMemberAssignments(
  familyMemberId: number,
): Promise<FamilyMemberAssignmentWithLocation[]> {
  await getFamilyMemberById(familyMemberId);
  const [rows] = await pool.query<(FamilyMemberAssignmentWithLocation & RowDataPacket)[]>(
    `SELECT fma.*, l.name AS location_name
     FROM FamilyMemberAssignment fma
     JOIN Location l ON l.location_id = fma.location_id
     WHERE fma.family_member_id = ?
     ORDER BY fma.start_date DESC`,
    [familyMemberId],
  );
  return rows;
}

export async function createFamilyMemberAssignmentFlat(
  input: CreateFamilyMemberAssignmentFlatInput,
): Promise<FamilyMemberAssignmentWithLocation> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO FamilyMemberAssignment (family_member_id, location_id, start_date, end_date)
       VALUES (?, ?, ?, ?)`,
      [input.family_member_id, input.location_id, input.start_date, input.end_date ?? null],
    );
    const [rows] = await pool.query<(FamilyMemberAssignmentWithLocation & RowDataPacket)[]>(
      `SELECT fma.*, l.name AS location_name
       FROM FamilyMemberAssignment fma
       JOIN Location l ON l.location_id = fma.location_id
       WHERE fma.assignment_id = ?`,
      [result.insertId],
    );
    return rows[0];
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        'An assignment for this family member, location, and start date already exists',
      );
    }
    throw err;
  }
}

export async function createFamilyMemberAssignment(
  familyMemberId: number,
  input: CreateFamilyMemberAssignmentInput,
): Promise<FamilyMemberAssignmentWithLocation> {
  await getFamilyMemberById(familyMemberId);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO FamilyMemberAssignment (family_member_id, location_id, start_date, end_date)
       VALUES (?, ?, ?, ?)`,
      [familyMemberId, input.location_id, input.start_date, input.end_date ?? null],
    );
    const [rows] = await pool.query<(FamilyMemberAssignmentWithLocation & RowDataPacket)[]>(
      `SELECT fma.*, l.name AS location_name
       FROM FamilyMemberAssignment fma
       JOIN Location l ON l.location_id = fma.location_id
       WHERE fma.assignment_id = ?`,
      [result.insertId],
    );
    return rows[0];
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        'An assignment for this family member, location, and start date already exists',
      );
    }
    throw err;
  }
}

export async function updateFamilyMemberAssignment(
  assignmentId: number,
  input: UpdateFamilyMemberAssignmentInput,
): Promise<FamilyMemberAssignmentWithLocation> {
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT assignment_id FROM FamilyMemberAssignment WHERE assignment_id = ?',
    [assignmentId],
  );
  if (!existing[0]) throw new NotFoundError('FamilyMemberAssignment', assignmentId);

  const fields = Object.keys(input) as (keyof UpdateFamilyMemberAssignmentInput)[];
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => input[f]);
  try {
    await pool.query<ResultSetHeader>(
      `UPDATE FamilyMemberAssignment SET ${setClause} WHERE assignment_id = ?`,
      [...values, assignmentId],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        'An assignment for this family member, location, and start date already exists',
      );
    }
    throw err;
  }
  const [rows] = await pool.query<(FamilyMemberAssignmentWithLocation & RowDataPacket)[]>(
    `SELECT fma.*, l.name AS location_name
     FROM FamilyMemberAssignment fma
     JOIN Location l ON l.location_id = fma.location_id
     WHERE fma.assignment_id = ?`,
    [assignmentId],
  );
  return rows[0];
}

export async function deleteFamilyMemberAssignment(assignmentId: number): Promise<void> {
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT assignment_id FROM FamilyMemberAssignment WHERE assignment_id = ?',
    [assignmentId],
  );
  if (!existing[0]) throw new NotFoundError('FamilyMemberAssignment', assignmentId);
  await pool.query<ResultSetHeader>(
    'DELETE FROM FamilyMemberAssignment WHERE assignment_id = ?',
    [assignmentId],
  );
}
