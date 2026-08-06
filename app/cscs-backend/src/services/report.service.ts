import { RowDataPacket } from 'mysql2';
import { pool } from '../db/database';

// TO DOOOOOO
const implemented: Record<number, { description: string; sql: string }> = {
  11: { description: 'Members who participated in at least five FIFA games', sql: `SELECT cm.membership_number, cm.first_name, cm.last_name, COUNT(*) AS fifa_games, MIN(YEAR(fg.game_date)) AS min_year, MAX(YEAR(fg.game_date)) AS max_year FROM ClubMember cm JOIN FIFAParticipation fp ON fp.membership_number=cm.membership_number JOIN FIFAGame fg ON fg.game_id=fp.game_id GROUP BY cm.membership_number HAVING COUNT(*) >= 5 ORDER BY fifa_games DESC` },
};

export function getReportCatalog() {
  return Array.from({ length: 12 }, (_, i) => i + 8).map((id) => ({
    id,
    status: implemented[id] ? 'implemented' : 'placeholder',
    description: implemented[id]?.description ?? `Complex project query Q${id}; endpoint and parameter contract are ready for SQL implementation`,
  }));
}

export async function runReport(id: number, params: Record<string, unknown>) {
  const report = implemented[id];
  if (!report) return { id, status: 'placeholder', params, rows: [], message: `Q${id} is intentionally scaffolded; add its SQL in report.service.ts without changing the API.` };
  const [rows] = await pool.query<RowDataPacket[]>(report.sql);
  return { id, status: 'implemented', params, rows };
}
