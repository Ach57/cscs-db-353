import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import {
  Session,
  SessionWithFormations,
  CreateSessionInput,
  UpdateSessionInput,
} from '../types/session.types';
import { NotFoundError } from '../utils/AppError';

export async function getAllSessions(): Promise<Session[]> {
  const [rows] = await pool.query<(Session & RowDataPacket)[]>(
    'SELECT * FROM Session ORDER BY session_datetime DESC',
  );
  return rows;
}

export async function getSessionById(id: number): Promise<SessionWithFormations> {
  const [sessions] = await pool.query<(Session & RowDataPacket)[]>(
    'SELECT * FROM Session WHERE session_id = ?',
    [id],
  );
  if (!sessions[0]) throw new NotFoundError('Session', id);

  const [formations] = await pool.query<RowDataPacket[]>(
    `SELECT tf.*, p.first_name AS coach_first_name, p.last_name AS coach_last_name
     FROM TeamFormation tf
     JOIN Personnel p ON p.personnel_id = tf.head_coach_id
     WHERE tf.session_id = ?
     ORDER BY tf.formation_id`,
    [id],
  );

  return { ...sessions[0], formations: formations as SessionWithFormations['formations'] };
}

export async function createSession(input: CreateSessionInput): Promise<SessionWithFormations> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO Session (session_datetime, address, session_type) VALUES (?, ?, ?)`,
    [input.session_datetime, input.address, input.session_type],
  );
  return getSessionById(result.insertId);
}

export async function updateSession(
  id: number,
  input: UpdateSessionInput,
): Promise<SessionWithFormations> {
  // 404 early if session doesn't exist
  await getSessionById(id);
  const fields = Object.keys(input) as (keyof UpdateSessionInput)[];
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => input[f]);
  await pool.query<ResultSetHeader>(
    `UPDATE Session SET ${setClause} WHERE session_id = ?`,
    [...values, id],
  );
  return getSessionById(id);
}

export async function deleteSession(id: number): Promise<void> {
  await getSessionById(id);
  await pool.query<ResultSetHeader>('DELETE FROM Session WHERE session_id = ?', [id]);
}
