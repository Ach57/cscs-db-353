import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import { EmailLog, CreateEmailLogInput } from '../types/email.types';
import { NotFoundError } from '../utils/AppError';

export async function getAllEmailLogs(): Promise<EmailLog[]> {
  const [rows] = await pool.query<(EmailLog & RowDataPacket)[]>(
    'SELECT * FROM EmailLog ORDER BY email_date DESC',
  );
  return rows;
}

export async function getEmailLogById(id: number): Promise<EmailLog> {
  const [rows] = await pool.query<(EmailLog & RowDataPacket)[]>(
    'SELECT * FROM EmailLog WHERE email_id = ?',
    [id],
  );
  if (!rows[0]) throw new NotFoundError('EmailLog', id);
  return rows[0];
}

export async function createEmailLog(input: CreateEmailLogInput): Promise<EmailLog> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO EmailLog (email_date, membership_number, formation_id, subject, body_snippet)
     VALUES (?, ?, ?, ?, ?)`,
    [
      input.email_date, input.membership_number, input.formation_id,
      input.subject, input.body_snippet,
    ],
  );
  return getEmailLogById(result.insertId);
}
