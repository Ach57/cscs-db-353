import { z } from 'zod';

const baseFamilyMemberFields = {
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  ssn: z.string().min(1).max(15),
  medicare_number: z.string().max(20).optional(),
  phone_number: z.string().max(20).optional(),
  address: z.string().max(150).optional(),
  city: z.string().max(60).optional(),
  province: z.string().length(2).optional(),
  postal_code: z.string().max(10).optional(),
  email: z.string().email().max(100).optional(),
};

export const createFamilyMemberSchema = z.object(baseFamilyMemberFields);

export const updateFamilyMemberSchema = z
  .object(baseFamilyMemberFields)
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  });

export const familyMemberIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Combined schema for routes that need both :id and :assignmentId
export const familyMemberAssignmentParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  assignmentId: z.coerce.number().int().positive(),
});

export const createFamilyMemberAssignmentSchema = z.object({
  location_id: z.number().int().positive(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
});

export const updateFamilyMemberAssignmentSchema = createFamilyMemberAssignmentSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateFamilyMemberInput = z.infer<typeof createFamilyMemberSchema>;
export type UpdateFamilyMemberInput = z.infer<typeof updateFamilyMemberSchema>;
export type CreateFamilyMemberAssignmentInput = z.infer<typeof createFamilyMemberAssignmentSchema>;
export type UpdateFamilyMemberAssignmentInput = z.infer<typeof updateFamilyMemberAssignmentSchema>;

export interface FamilyMember {
  family_member_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  ssn: string;
  medicare_number: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  email: string | null;
}

export interface FamilyMemberAssignment {
  assignment_id: number;
  family_member_id: number;
  location_id: number;
  start_date: string;
  end_date: string | null;
}

export interface FamilyMemberAssignmentWithLocation extends FamilyMemberAssignment {
  location_name: string;
}
