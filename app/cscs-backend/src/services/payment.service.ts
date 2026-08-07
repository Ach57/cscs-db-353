import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import { Payment, CreatePaymentInput, UpdatePaymentInput } from '../types/payment.types';
import { NotFoundError, ConflictError } from '../utils/AppError';

interface MysqlError extends Error {
  code?: string;
}

export async function getAllPayments(): Promise<Payment[]> {
  const [rows] = await pool.query<(Payment & RowDataPacket)[]>(
    'SELECT * FROM Payment ORDER BY payment_date DESC',
  );
  return rows;
}

export async function getPaymentById(id: number): Promise<Payment> {
  const [rows] = await pool.query<(Payment & RowDataPacket)[]>(
    'SELECT * FROM Payment WHERE payment_id = ?',
    [id],
  );
  if (!rows[0]) throw new NotFoundError('Payment', id);
  return rows[0];
}

export async function getMemberPayments(membershipNumber: number): Promise<Payment[]> {
  const [rows] = await pool.query<(Payment & RowDataPacket)[]>(
    'SELECT * FROM Payment WHERE membership_number = ? ORDER BY membership_year DESC, installment_number',
    [membershipNumber],
  );
  return rows;
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Payment
         (membership_number, payment_date, amount, payment_method,
          membership_year, installment_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        input.membership_number, input.payment_date, input.amount,
        input.payment_method, input.membership_year, input.installment_number,
      ],
    );
    return getPaymentById(result.insertId);
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        'A payment for this member, year, and installment number already exists',
      );
    }
    throw err;
  }
}

export async function deletePayment(id: number): Promise<void> {
  await getPaymentById(id);
  await pool.query<ResultSetHeader>('DELETE FROM Payment WHERE payment_id = ?', [id]);
}


export async function updatePayment(id: number, input: UpdatePaymentInput): Promise<Payment> {
  await getPaymentById(id);
  const fields = Object.keys(input) as (keyof UpdatePaymentInput)[];
  const values = fields.map((field) => input[field]);
  try {
    await pool.query<ResultSetHeader>(
      `UPDATE Payment SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE payment_id = ?`,
      [...values, id],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') throw new ConflictError('Duplicate installment number for this member and year');
    throw err;
  }
  return getPaymentById(id);
}

export async function getMemberFinancialSummary(membershipNumber: number, year: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT cm.membership_number, cm.first_name, cm.last_name,
            TIMESTAMPDIFF(YEAR, cm.date_of_birth, STR_TO_DATE(CONCAT(?, '-12-31'), '%Y-%m-%d')) AS age_at_year_end,
            CASE WHEN TIMESTAMPDIFF(YEAR, cm.date_of_birth, STR_TO_DATE(CONCAT(?, '-12-31'), '%Y-%m-%d')) >= 18 THEN 200 ELSE 100 END AS fee_due,
            COALESCE(SUM(p.amount), 0) AS total_paid, COUNT(p.payment_id) AS installment_count
       FROM ClubMember cm
       LEFT JOIN Payment p ON p.membership_number = cm.membership_number AND p.membership_year = ?
      WHERE cm.membership_number = ?
      GROUP BY cm.membership_number`,
    [year, year, year, membershipNumber],
  );
  if (!rows[0]) throw new NotFoundError('ClubMember', membershipNumber);
  const row = rows[0];
  const paid = Number(row.total_paid); const due = Number(row.fee_due);
  return { ...row, donation_amount: Math.max(0, paid - due), balance_due: Math.max(0, due - paid), paid_in_full: paid >= due };
}
