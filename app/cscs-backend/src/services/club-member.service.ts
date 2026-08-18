import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db/database';
import {
  ClubMember,
  Hobby,
  ClubMemberFamilyRelationWithName,
  CreateClubMemberInput,
  UpdateClubMemberInput,
  CreateHobbyInput,
  CreateFamilyRelationInput,
  UpdateFamilyRelationInput,
  CreateFlatFamilyRelationInput,
} from '../types/club-member.types';
import { NotFoundError, ConflictError } from '../utils/AppError';

interface MysqlError extends Error {
  code?: string;
}

// ── Club Members ─────────────────────────────────────────────────────────────

export async function getAllClubMembers(): Promise<ClubMember[]> {
  const [rows] = await pool.query<(ClubMember & RowDataPacket)[]>(
    'SELECT * FROM ClubMember ORDER BY last_name, first_name',
  );
  return rows;
}

export async function getClubMemberById(id: number): Promise<ClubMember> {
  const [rows] = await pool.query<(ClubMember & RowDataPacket)[]>(
    'SELECT * FROM ClubMember WHERE membership_number = ?',
    [id],
  );
  if (!rows[0]) throw new NotFoundError('ClubMember', id);
  return rows[0];
}

export async function createClubMember(
  input: CreateClubMemberInput,
): Promise<ClubMember> {
  const { family_relation, ...member } = input;
  const memberValues = [
    member.location_id, member.first_name, member.last_name, member.date_of_birth,
    member.gender, member.registration_date,
    member.height_cm ?? null, member.weight_kg ?? null,
    member.ssn ?? null, member.medicare_number ?? null,
    member.phone_number ?? null, member.address ?? null,
    member.city ?? null, member.province ?? null,
    member.postal_code ?? null, member.email ?? null,
  ];
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO ClubMember
         (location_id, first_name, last_name, date_of_birth, gender, registration_date,
          height_cm, weight_kg, ssn, medicare_number, phone_number,
          address, city, province, postal_code, email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      memberValues,
    );
    const id = result.insertId;
    if (family_relation) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO ClubMemberFamilyRelation
           (membership_number, family_member_id, relationship_type, family_member_type, start_date)
         VALUES (?, ?, ?, ?, ?)`,
        [id, family_relation.family_member_id, family_relation.relationship_type,
         family_relation.family_member_type, family_relation.start_date],
      );
    }
    await conn.commit();
    return getClubMemberById(id);
  } catch (err) {
    await conn.rollback();
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError('A club member with that SSN or medicare number already exists');
    }
    throw err;
  } finally {
    conn.release();
  }
}

export async function updateClubMember(
  id: number,
  input: UpdateClubMemberInput,
): Promise<ClubMember> {
  await getClubMemberById(id);
  const fields = Object.keys(input) as (keyof UpdateClubMemberInput)[];
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => input[f]);
  try {
    await pool.query<ResultSetHeader>(
      `UPDATE ClubMember SET ${setClause} WHERE membership_number = ?`,
      [...values, id],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        'A club member with that SSN or medicare number already exists',
      );
    }
    throw err;
  }
  return getClubMemberById(id);
}

export async function deleteClubMember(id: number): Promise<void> {
  await getClubMemberById(id);
  await pool.query<ResultSetHeader>(
    'DELETE FROM ClubMember WHERE membership_number = ?',
    [id],
  );
}

// ── Hobbies catalog ──────────────────────────────────────────────────────────

export async function getAllHobbies(): Promise<Hobby[]> {
  const [rows] = await pool.query<(Hobby & RowDataPacket)[]>(
    'SELECT * FROM Hobby ORDER BY hobby_name',
  );
  return rows;
}

export async function createHobby(input: CreateHobbyInput): Promise<Hobby> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO Hobby (hobby_name) VALUES (?)',
      [input.hobby_name],
    );
    const [rows] = await pool.query<(Hobby & RowDataPacket)[]>(
      'SELECT * FROM Hobby WHERE hobby_id = ?',
      [result.insertId],
    );
    return rows[0];
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        `A hobby named "${input.hobby_name}" already exists`,
      );
    }
    throw err;
  }
}

export async function deleteHobby(hobbyId: number): Promise<void> {
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT hobby_id FROM Hobby WHERE hobby_id = ?',
    [hobbyId],
  );
  if (!existing[0]) throw new NotFoundError('Hobby', hobbyId);
  await pool.query<ResultSetHeader>('DELETE FROM Hobby WHERE hobby_id = ?', [
    hobbyId,
  ]);
}

// ── Member–Hobby relations ───────────────────────────────────────────────────

export async function getMemberHobbies(
  membershipNumber: number,
): Promise<Hobby[]> {
  await getClubMemberById(membershipNumber);
  const [rows] = await pool.query<(Hobby & RowDataPacket)[]>(
    `SELECT h.*
     FROM Hobby h
     JOIN ClubMemberHobby cmh ON cmh.hobby_id = h.hobby_id
     WHERE cmh.membership_number = ?
     ORDER BY h.hobby_name`,
    [membershipNumber],
  );
  return rows;
}

export async function addMemberHobby(
  membershipNumber: number,
  hobbyId: number,
): Promise<Hobby[]> {
  await getClubMemberById(membershipNumber);
  const [hobbyRows] = await pool.query<RowDataPacket[]>(
    'SELECT hobby_id FROM Hobby WHERE hobby_id = ?',
    [hobbyId],
  );
  if (!hobbyRows[0]) throw new NotFoundError('Hobby', hobbyId);

  try {
    await pool.query<ResultSetHeader>(
      'INSERT INTO ClubMemberHobby (membership_number, hobby_id) VALUES (?, ?)',
      [membershipNumber, hobbyId],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError('This member already has that hobby');
    }
    throw err;
  }
  return getMemberHobbies(membershipNumber);
}

export async function removeMemberHobby(
  membershipNumber: number,
  hobbyId: number,
): Promise<void> {
  await getClubMemberById(membershipNumber);
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM ClubMemberHobby WHERE membership_number = ? AND hobby_id = ?',
    [membershipNumber, hobbyId],
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError(`Hobby ${hobbyId} on member`, membershipNumber);
  }
}

// ── Family relations ─────────────────────────────────────────────────────────

export async function getAllFamilyRelations(): Promise<ClubMemberFamilyRelationWithName[]> {
  const [rows] = await pool.query<(ClubMemberFamilyRelationWithName & RowDataPacket)[]>(
    `SELECT cfr.*, fm.first_name, fm.last_name
     FROM ClubMemberFamilyRelation cfr
     JOIN FamilyMember fm ON fm.family_member_id = cfr.family_member_id
     ORDER BY cfr.membership_number, cfr.start_date DESC`,
  );
  return rows;
}

export async function createFlatFamilyRelation(
  input: CreateFlatFamilyRelationInput,
): Promise<ClubMemberFamilyRelationWithName> {
  await getClubMemberById(input.membership_number);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO ClubMemberFamilyRelation
         (membership_number, family_member_id, relationship_type,
          family_member_type, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        input.membership_number,
        input.family_member_id,
        input.relationship_type,
        input.family_member_type,
        input.start_date,
        input.end_date ?? null,
      ],
    );
    const [rows] = await pool.query<(ClubMemberFamilyRelationWithName & RowDataPacket)[]>(
      `SELECT cfr.*, fm.first_name, fm.last_name
       FROM ClubMemberFamilyRelation cfr
       JOIN FamilyMember fm ON fm.family_member_id = cfr.family_member_id
       WHERE cfr.relation_id = ?`,
      [result.insertId],
    );
    return rows[0];
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        'A relation for this member, family member, and start date already exists',
      );
    }
    throw err;
  }
}

export async function getMemberFamilyRelations(
  membershipNumber: number,
): Promise<ClubMemberFamilyRelationWithName[]> {
  await getClubMemberById(membershipNumber);
  const [rows] = await pool.query<
    (ClubMemberFamilyRelationWithName & RowDataPacket)[]
  >(
    `SELECT cfr.*, fm.first_name, fm.last_name
     FROM ClubMemberFamilyRelation cfr
     JOIN FamilyMember fm ON fm.family_member_id = cfr.family_member_id
     WHERE cfr.membership_number = ?
     ORDER BY cfr.start_date DESC`,
    [membershipNumber],
  );
  return rows;
}

export async function createFamilyRelation(
  membershipNumber: number,
  input: CreateFamilyRelationInput,
): Promise<ClubMemberFamilyRelationWithName> {
  await getClubMemberById(membershipNumber);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO ClubMemberFamilyRelation
         (membership_number, family_member_id, relationship_type,
          family_member_type, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        membershipNumber,
        input.family_member_id,
        input.relationship_type,
        input.family_member_type,
        input.start_date,
        input.end_date ?? null,
      ],
    );
    const [rows] = await pool.query<
      (ClubMemberFamilyRelationWithName & RowDataPacket)[]
    >(
      `SELECT cfr.*, fm.first_name, fm.last_name
       FROM ClubMemberFamilyRelation cfr
       JOIN FamilyMember fm ON fm.family_member_id = cfr.family_member_id
       WHERE cfr.relation_id = ?`,
      [result.insertId],
    );
    return rows[0];
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        'A relation for this member, family member, and start date already exists',
      );
    }
    throw err;
  }
}

export async function updateFamilyRelation(
  relationId: number,
  input: UpdateFamilyRelationInput,
): Promise<ClubMemberFamilyRelationWithName> {
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT relation_id FROM ClubMemberFamilyRelation WHERE relation_id = ?',
    [relationId],
  );
  if (!existing[0]) throw new NotFoundError('FamilyRelation', relationId);

  const fields = Object.keys(input) as (keyof UpdateFamilyRelationInput)[];
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => input[f]);
  try {
    await pool.query<ResultSetHeader>(
      `UPDATE ClubMemberFamilyRelation SET ${setClause} WHERE relation_id = ?`,
      [...values, relationId],
    );
  } catch (err) {
    if ((err as MysqlError).code === 'ER_DUP_ENTRY') {
      throw new ConflictError(
        'A relation for this member, family member, and start date already exists',
      );
    }
    throw err;
  }
  const [rows] = await pool.query<
    (ClubMemberFamilyRelationWithName & RowDataPacket)[]
  >(
    `SELECT cfr.*, fm.first_name, fm.last_name
     FROM ClubMemberFamilyRelation cfr
     JOIN FamilyMember fm ON fm.family_member_id = cfr.family_member_id
     WHERE cfr.relation_id = ?`,
    [relationId],
  );
  return rows[0];
}

export async function deleteFamilyRelation(relationId: number): Promise<void> {
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT relation_id FROM ClubMemberFamilyRelation WHERE relation_id = ?',
    [relationId],
  );
  if (!existing[0]) throw new NotFoundError('FamilyRelation', relationId);
  await pool.query<ResultSetHeader>(
    'DELETE FROM ClubMemberFamilyRelation WHERE relation_id = ?',
    [relationId],
  );
}
