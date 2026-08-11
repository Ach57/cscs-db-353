import { z } from 'zod';

export const genderEnum = z.enum(['Male', 'Female']);

export const relationshipTypeEnum = z.enum([
  'Father',
  'Mother',
  'Grandfather',
  'Grandmother',
  'Tutor',
  'Partner',
  'Friend',
  'Other',
]);

export const familyMemberTypeEnum = z.enum(['Primary', 'Secondary']);

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD');

// Carries the linked-family-member data through to
// sp_register_minor_club_member when the club member being created is a
// minor. Whether it's actually required is a DB-trigger decision, not
// re-validated here -- see trg_club_member_before_insert in 05_trigger.sql.
const familyRelationForRegistrationSchema = z.object({
  family_member_id: z.number().int().positive(),
  relationship_type: relationshipTypeEnum,
  family_member_type: familyMemberTypeEnum,
  start_date: dateStringSchema,
});

const baseClubMemberFields = {
  location_id: z.number().int().positive(),
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  gender: genderEnum,
  registration_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  height_cm: z.number().positive().optional(),
  weight_kg: z.number().positive().optional(),
  ssn: z.string().max(15).optional(),
  medicare_number: z.string().max(20).optional(),
  phone_number: z.string().max(20).optional(),
  address: z.string().max(150).optional(),
  city: z.string().max(60).optional(),
  province: z.string().length(2).optional(),
  postal_code: z.string().max(10).optional(),
  email: z.string().email().max(100).optional(),
};

export const createClubMemberSchema = z.object({
  ...baseClubMemberFields,
  family_relation: familyRelationForRegistrationSchema.optional(),
});

export const updateClubMemberSchema = z
  .object(baseClubMemberFields)
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  });

export const membershipNumberParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const addHobbySchema = z.object({
  hobby_id: z.number().int().positive(),
});

export const createHobbySchema = z.object({
  hobby_name: z.string().min(1).max(50),
});

export const hobbyIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Combined schema for routes with both :id (membership) and :hobbyId
export const memberHobbyParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  hobbyId: z.coerce.number().int().positive(),
});

export const createFamilyRelationSchema = z.object({
  family_member_id: z.number().int().positive(),
  relationship_type: relationshipTypeEnum,
  family_member_type: familyMemberTypeEnum,
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
});

export const updateFamilyRelationSchema = createFamilyRelationSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  });

// Combined schema for routes with both :id (membership) and :relationId
export const memberRelationParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  relationId: z.coerce.number().int().positive(),
});

export type CreateClubMemberInput = z.infer<typeof createClubMemberSchema>;
export type UpdateClubMemberInput = z.infer<typeof updateClubMemberSchema>;
export type AddHobbyInput = z.infer<typeof addHobbySchema>;
export type CreateHobbyInput = z.infer<typeof createHobbySchema>;
export type CreateFamilyRelationInput = z.infer<typeof createFamilyRelationSchema>;
export type UpdateFamilyRelationInput = z.infer<typeof updateFamilyRelationSchema>;

export interface ClubMember {
  membership_number: number;
  location_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  registration_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  ssn: string | null;
  medicare_number: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  email: string | null;
}

export interface Hobby {
  hobby_id: number;
  hobby_name: string;
}

export interface ClubMemberFamilyRelation {
  relation_id: number;
  membership_number: number;
  family_member_id: number;
  relationship_type: string;
  family_member_type: string;
  start_date: string;
  end_date: string | null;
}

export interface ClubMemberFamilyRelationWithName extends ClubMemberFamilyRelation {
  first_name: string;
  last_name: string;
}
