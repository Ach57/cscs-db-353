import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import { EmailLog, CreateEmailLogInput } from '../types/email.types';
import { NotFoundError } from '../utils/AppError';

export async function getAllEmailLogs(): Promise<EmailLog[]> {
  const [rows] = await pool.query<(EmailLog & RowDataPacket)[]>(
    `SELECT el.*, l.name AS sender_name, cm.email AS receiver_email,
            cm.first_name AS receiver_first_name, cm.last_name AS receiver_last_name,
            tf.team_name
       FROM EmailLog el
       JOIN ClubMember cm ON cm.membership_number = el.membership_number
       JOIN TeamFormation tf ON tf.formation_id = el.formation_id
       JOIN Location l ON l.location_id = tf.location_id
      ORDER BY el.email_date DESC, el.email_id DESC`,
  );
  return rows;
}

export async function getEmailLogById(id: number): Promise<EmailLog> {
  const [rows] = await pool.query<(EmailLog & RowDataPacket)[]>(
    `SELECT el.*, l.name AS sender_name, cm.email AS receiver_email,
            cm.first_name AS receiver_first_name, cm.last_name AS receiver_last_name,
            tf.team_name
       FROM EmailLog el
       JOIN ClubMember cm ON cm.membership_number = el.membership_number
       JOIN TeamFormation tf ON tf.formation_id = el.formation_id
       JOIN Location l ON l.location_id = tf.location_id
      WHERE el.email_id = ?`,
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

export async function generateWeeklyEmails(fromDate?: string, persist = true) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT tf.formation_id, tf.team_name, s.session_datetime, s.session_type, s.address,
            l.name AS sender_name, cm.membership_number, cm.first_name, cm.last_name, cm.email AS receiver_email,
            tfa.role, p.first_name AS coach_first_name, p.last_name AS coach_last_name, p.email AS coach_email
       FROM TeamFormation tf
       JOIN Session s ON s.session_id=tf.session_id
       JOIN Location l ON l.location_id=tf.location_id
       JOIN Personnel p ON p.personnel_id=tf.head_coach_id
       JOIN TeamFormationAssignment tfa ON tfa.formation_id=tf.formation_id
       JOIN ClubMember cm ON cm.membership_number=tfa.membership_number
      WHERE s.session_datetime >= COALESCE(?, CURDATE())
        AND s.session_datetime < DATE_ADD(COALESCE(?, CURDATE()), INTERVAL 7 DAY)
      ORDER BY s.session_datetime, tf.team_name, cm.last_name`,
    [fromDate ?? null, fromDate ?? null],
  );
  const emails = rows.map((r: RowDataPacket) => {
    const dt = new Date(r.session_datetime as string);
    const subject = `${r.team_name} ${dt.toLocaleString('en-CA')} ${String(r.session_type).toLowerCase()} session`;
    const body = `Hello ${r.first_name} ${r.last_name}, you are assigned as ${r.role}. Head coach: ${r.coach_first_name} ${r.coach_last_name} (${r.coach_email ?? 'no email'}). ${r.session_type} at ${r.address}.`;
    return { ...r, subject: subject.slice(0, 150), body, body_snippet: body.slice(0, 100) };
  });
  if (persist && emails.length) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const e of emails as Array<Record<string, any>>) await conn.query(
        `INSERT INTO EmailLog (email_date, membership_number, formation_id, subject, body_snippet) VALUES (CURDATE(), ?, ?, ?, ?)`,
        [e.membership_number, e.formation_id, e.subject, e.body_snippet],
      );
      await conn.commit();
    } catch (error) { await conn.rollback(); throw error; } finally { conn.release(); }
  }
  return { generated_count: emails.length, persisted: persist, emails };
}
