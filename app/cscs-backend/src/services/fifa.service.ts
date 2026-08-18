import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import {
  FIFAGame,
  FIFAGameWithParticipants,
  FIFAParticipant,
  CreateFIFAGameInput,
  UpdateFIFAGameInput,
  AddParticipantInput,
  FIFAParticipantOverview,
} from '../types/fifa.types';
import { NotFoundError, ConflictError } from '../utils/AppError';

interface MysqlError extends Error {
  code?: string;
}

export async function getAllGames(): Promise<FIFAGame[]> {
  const [rows] = await pool.query<(FIFAGame & RowDataPacket)[]>(
    `SELECT fg.*,
            l.name AS location_name,
            COUNT(fp.membership_number) AS participant_count
       FROM FIFAGame fg
       JOIN Location l ON l.location_id = fg.location_id
       LEFT JOIN FIFAParticipation fp ON fp.game_id = fg.game_id
      GROUP BY fg.game_id, fg.location_id, fg.team_name, fg.opponent_name,
               fg.game_date, fg.team_score, fg.opponent_score, l.name
      ORDER BY fg.game_date DESC, fg.game_id DESC`,
  );
  return rows;
}


export async function getParticipantOverview(): Promise<FIFAParticipantOverview[]> {
  const [rows] = await pool.query<(FIFAParticipantOverview & RowDataPacket)[]>(
    `SELECT cm.membership_number,
            cm.first_name,
            cm.last_name,
            cm.location_id,
            l.name AS location_name,
            COUNT(fp.game_id) AS fifa_game_count,
            GROUP_CONCAT(
              DISTINCT CONCAT(
                fg.team_name,
                ' vs ', fg.opponent_name,
                ' (#', fg.game_id, ')',
                ' · ', DATE_FORMAT(fg.game_date, '%Y-%m-%d')
              )
              ORDER BY fg.game_date, fg.game_id
              SEPARATOR ' | '
            ) AS fifa_games
       FROM ClubMember cm
       JOIN Location l ON l.location_id = cm.location_id
       LEFT JOIN FIFAParticipation fp ON fp.membership_number = cm.membership_number
       LEFT JOIN FIFAGame fg ON fg.game_id = fp.game_id
      GROUP BY cm.membership_number, cm.first_name, cm.last_name, cm.location_id, l.name
      ORDER BY cm.membership_number ASC`,
  );
  return rows;
}

export async function getGameById(id: number): Promise<FIFAGameWithParticipants> {
  const [games] = await pool.query<(FIFAGame & RowDataPacket)[]>(
    'SELECT * FROM FIFAGame WHERE game_id = ?',
    [id],
  );
  if (!games[0]) throw new NotFoundError('FIFAGame', id);

  const [participants] = await pool.query<(FIFAParticipant & RowDataPacket)[]>(
    `SELECT fp.game_id, fp.membership_number, cm.first_name, cm.last_name
     FROM FIFAParticipation fp
     JOIN ClubMember cm ON cm.membership_number = fp.membership_number
     WHERE fp.game_id = ?
     ORDER BY cm.last_name, cm.first_name`,
    [id],
  );

  return { ...games[0], participants };
}

export async function createGame(input: CreateFIFAGameInput): Promise<FIFAGameWithParticipants> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO FIFAGame
       (location_id, team_name, opponent_name, game_date, team_score, opponent_score)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.location_id, input.team_name, input.opponent_name,
      input.game_date, input.team_score, input.opponent_score,
    ],
  );
  return getGameById(result.insertId);
}

export async function updateGame(
  id: number,
  input: UpdateFIFAGameInput,
): Promise<FIFAGameWithParticipants> {
  await getGameById(id);
  const fields = Object.keys(input) as (keyof UpdateFIFAGameInput)[];
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => input[f]);
  await pool.query<ResultSetHeader>(
    `UPDATE FIFAGame SET ${setClause} WHERE game_id = ?`,
    [...values, id],
  );
  return getGameById(id);
}

export async function deleteGame(id: number): Promise<void> {
  await getGameById(id);
  await pool.query<ResultSetHeader>('DELETE FROM FIFAGame WHERE game_id = ?', [id]);
}

export async function addParticipant(
  gameId: number,
  input: AddParticipantInput,
): Promise<FIFAGameWithParticipants> {
  await getGameById(gameId);
  try {
    await pool.query<ResultSetHeader>(
      'INSERT INTO FIFAParticipation (game_id, membership_number) VALUES (?, ?)',
      [gameId, input.membership_number],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError('This member is already a participant in this game');
    }
    throw err;
  }
  return getGameById(gameId);
}

export async function removeParticipant(
  gameId: number,
  membershipNumber: number,
): Promise<void> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM FIFAParticipation WHERE game_id = ? AND membership_number = ?',
    [gameId, membershipNumber],
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError(`Participant ${membershipNumber} in game`, gameId);
  }
}
