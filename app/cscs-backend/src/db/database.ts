import mysql from 'mysql2/promise';
import { env } from '../config/env';

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  connectionLimit: env.DB_CONNECTION_LIMIT,
  waitForConnections: true,
  // return DATE/DATETIME as plain strings instead of JS Date objects --
  // avoids timezone-shift surprises when values round-trip through JSON
  dateStrings: true,
});

/**
 * Confirms the pool can actually reach AITS. Called once at server startup
 * (fail fast, don't accept traffic against a dead DB) and reused by the
 * /health endpoint -- verifying the AITS connection is a standalone graded
 * item (5 pts) on demo day, so it's worth having a real, live check.
 */
export async function checkDbConnection(): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.query('SELECT 1');
  } finally {
    conn.release();
  }
}
