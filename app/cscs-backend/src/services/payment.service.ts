import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import { Payment, CreatePaymentInput } from '../types/payment.types';
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
