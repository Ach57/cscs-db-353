import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import {
  TeamFormationWithAssignments,
  CreateFormationInput,
  UpdateFormationInput,
  AddFormationMemberInput,
  UpdateFormationMemberInput,
} from '../types/session.types';
import { NotFoundError, ConflictError } from '../utils/AppError';

interface MysqlError extends Error {
  code?: string;
}

async function fetchFormationWithAssignments(
  formationId: number,
): Promise<TeamFormationWithAssignments> {
  const [formations] = await pool.query<RowDataPacket[]>(
    `SELECT tf.*, p.first_name AS coach_first_name, p.last_name AS coach_last_name
     FROM TeamFormation tf
     JOIN Personnel p ON p.personnel_id = tf.head_coach_id
     WHERE tf.formation_id = ?`,
    [formationId],
  );
  if (!formations[0]) throw new NotFoundError('TeamFormation', formationId);

  const [assignments] = await pool.query<RowDataPacket[]>(
    `SELECT tfa.*, cm.first_name, cm.last_name
     FROM TeamFormationAssignment tfa
     JOIN ClubMember cm ON cm.membership_number = tfa.membership_number
     WHERE tfa.formation_id = ?
     ORDER BY tfa.role`,
    [formationId],
  );

  return {
    ...(formations[0] as TeamFormationWithAssignments),
    assignments: assignments as TeamFormationWithAssignments['assignments'],
  };
}

export async function getAllFormations(): Promise<TeamFormationWithAssignments[]> {
  const [formations] = await pool.query<RowDataPacket[]>(
    `SELECT tf.*, s.session_datetime, s.session_type, s.address AS session_address,
            l.name AS location_name,
            p.first_name AS coach_first_name, p.last_name AS coach_last_name,
            COUNT(tfa.membership_number) AS player_count
       FROM TeamFormation tf
       JOIN Session s ON s.session_id = tf.session_id
       JOIN Location l ON l.location_id = tf.location_id
       JOIN Personnel p ON p.personnel_id = tf.head_coach_id
       LEFT JOIN TeamFormationAssignment tfa ON tfa.formation_id = tf.formation_id
      GROUP BY tf.formation_id, s.session_datetime, s.session_type, s.address,
               l.name, p.first_name, p.last_name
      ORDER BY s.session_datetime ASC, tf.team_name ASC`,
  );

  if (!formations.length) return [];

  const ids = formations.map((row) => row.formation_id as number);
  const placeholders = ids.map(() => '?').join(',');
  const [assignments] = await pool.query<RowDataPacket[]>(
    `SELECT tfa.*, cm.first_name, cm.last_name
       FROM TeamFormationAssignment tfa
       JOIN ClubMember cm ON cm.membership_number = tfa.membership_number
      WHERE tfa.formation_id IN (${placeholders})
      ORDER BY tfa.formation_id, tfa.role, cm.last_name, cm.first_name`,
    ids,
  );

  const byFormation = new Map<number, RowDataPacket[]>();
  for (const assignment of assignments) {
    const formationId = assignment.formation_id as number;
    byFormation.set(formationId, [...(byFormation.get(formationId) ?? []), assignment]);
  }

  return formations.map((formation) => ({
    ...(formation as TeamFormationWithAssignments),
    assignments: (byFormation.get(formation.formation_id as number) ?? []) as TeamFormationWithAssignments['assignments'],
  }));
}

export async function getFormationById(formationId: number): Promise<TeamFormationWithAssignments> {
  return fetchFormationWithAssignments(formationId);
}

export async function createFormation(
  input: CreateFormationInput,
): Promise<TeamFormationWithAssignments> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO TeamFormation
       (session_id, location_id, head_coach_id, team_name, score, team_category)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.session_id, input.location_id, input.head_coach_id,
      input.team_name, input.score ?? null, input.team_category,
    ],
  );
  return fetchFormationWithAssignments(result.insertId);
}

export async function updateFormation(
  formationId: number,
  input: UpdateFormationInput,
): Promise<TeamFormationWithAssignments> {
  await fetchFormationWithAssignments(formationId);
  const fields = Object.keys(input) as (keyof UpdateFormationInput)[];
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => input[f]);
  await pool.query<ResultSetHeader>(
    `UPDATE TeamFormation SET ${setClause} WHERE formation_id = ?`,
    [...values, formationId],
  );
  return fetchFormationWithAssignments(formationId);
}

export async function deleteFormation(formationId: number): Promise<void> {
  await fetchFormationWithAssignments(formationId);
  await pool.query<ResultSetHeader>(
    'DELETE FROM TeamFormation WHERE formation_id = ?',
    [formationId],
  );
}

export async function addFormationMember(
  formationId: number,
  input: AddFormationMemberInput,
): Promise<TeamFormationWithAssignments> {
  await fetchFormationWithAssignments(formationId);
  try {
    await pool.query<ResultSetHeader>(
      `INSERT INTO TeamFormationAssignment (formation_id, membership_number, role)
       VALUES (?, ?, ?)`,
      [formationId, input.membership_number, input.role],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError('This member is already assigned to this formation');
    }
    throw err;
  }
  return fetchFormationWithAssignments(formationId);
}

export async function updateFormationMember(
  formationId: number,
  membershipNumber: number,
  input: UpdateFormationMemberInput,
): Promise<TeamFormationWithAssignments> {
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT formation_id FROM TeamFormationAssignment WHERE formation_id = ? AND membership_number = ?',
    [formationId, membershipNumber],
  );
  if (!existing[0]) {
    throw new NotFoundError(`Member ${membershipNumber} in formation`, formationId);
  }
  await pool.query<ResultSetHeader>(
    'UPDATE TeamFormationAssignment SET role = ? WHERE formation_id = ? AND membership_number = ?',
    [input.role, formationId, membershipNumber],
  );
  return fetchFormationWithAssignments(formationId);
}

export async function removeFormationMember(
  formationId: number,
  membershipNumber: number,
): Promise<void> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM TeamFormationAssignment WHERE formation_id = ? AND membership_number = ?',
    [formationId, membershipNumber],
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError(`Member ${membershipNumber} in formation`, formationId);
  }
}
