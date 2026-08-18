import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import { CreateLocationInput, Location, LocationPhone, UpdateLocationInput } from '../types/location.types';
import { NotFoundError, ConflictError } from '../utils/AppError';

interface MysqlError extends Error {
  code?: string;
}

export async function getAllLocations(): Promise<Location[]> {
  const [rows] = await pool.query<(Location & RowDataPacket)[]>(
    'SELECT * FROM Location ORDER BY location_id',
  );
  return rows;
}

export async function getLocationById(id: number): Promise<Location> {
  const [rows] = await pool.query<(Location & RowDataPacket)[]>(
    'SELECT * FROM Location WHERE location_id = ?',
    [id],
  );
  const location = rows[0];
  if (!location) throw new NotFoundError('Location', id);
  return location;
}

export async function createLocation(input: CreateLocationInput): Promise<Location> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Location (location_type, name, address, city, province, postal_code, web_address, capacity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.location_type,
        input.name,
        input.address,
        input.city,
        input.province,
        input.postal_code,
        input.web_address ?? null,
        input.capacity,
      ],
    );
    return await getLocationById(result.insertId);
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(`A location named "${input.name}" already exists`);
    }
    throw err;
  }
}

export async function updateLocation(id: number, input: UpdateLocationInput): Promise<Location> {
  await getLocationById(id); // 404s early if the row doesn't exist

  const fields = Object.keys(input) as (keyof UpdateLocationInput)[];
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => input[f]);

  try {
    await pool.query<ResultSetHeader>(`UPDATE Location SET ${setClause} WHERE location_id = ?`, [
      ...values,
      id,
    ]);
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(`A location named "${input.name}" already exists`);
    }
    throw err;
  }

  return getLocationById(id);
}

export async function deleteLocation(id: number): Promise<void> {
  await getLocationById(id); // 404s early if the row doesn't exist
  await pool.query<ResultSetHeader>('DELETE FROM Location WHERE location_id = ?', [id]);
}


export async function getLocationPhones(locationId: number): Promise<LocationPhone[]> {
  await getLocationById(locationId);
  const [rows] = await pool.query<(LocationPhone & RowDataPacket)[]>(
    'SELECT location_id, phone_number FROM LocationPhone WHERE location_id = ? ORDER BY phone_number',
    [locationId],
  );
  return rows;
}

export async function addLocationPhone(locationId: number, phoneNumber: string): Promise<LocationPhone[]> {
  await getLocationById(locationId);
  try {
    await pool.query<ResultSetHeader>(
      'INSERT INTO LocationPhone (location_id, phone_number) VALUES (?, ?)',
      [locationId, phoneNumber],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') throw new ConflictError('Phone already exists for this location');
    throw err;
  }
  return getLocationPhones(locationId);
}

export async function removeLocationPhone(locationId: number, phoneNumber: string): Promise<void> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM LocationPhone WHERE location_id = ? AND phone_number = ?',
    [locationId, phoneNumber],
  );
  if (result.affectedRows === 0) throw new NotFoundError('Location phone', phoneNumber);
}
