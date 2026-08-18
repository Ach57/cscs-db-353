import { z } from 'zod';

export const personnelRoleEnum = z.enum([
  'General Manager',
  'Deputy Manager',
  'Treasurer',
  'Secretary',
  'Administrator',
  'Captain',
  'Coach',
  'Assistant Coach',
  'Other',
]);

export const personnelMandateEnum = z.enum(['Volunteer', 'Salaried']);

const basePersonnelFields = {
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
  role: personnelRoleEnum,
  mandate: personnelMandateEnum,
};

export const createPersonnelSchema = z.object(basePersonnelFields);

export const updatePersonnelSchema = z
  .object(basePersonnelFields)
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  });

export const personnelIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Combined schema for routes that need both :id and :assignmentId
export const personnelAssignmentParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  assignmentId: z.coerce.number().int().positive(),
});

export const createPersonnelAssignmentSchema = z.object({
  location_id: z.number().int().positive(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
    .optional(),
});

export const updatePersonnelAssignmentSchema = createPersonnelAssignmentSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  });

export const createPersonnelAssignmentFlatSchema = z.object({
  personnel_id: z.number().int().positive(),
  location_id: z.number().int().positive(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
    .nullable()
    .optional(),
});

export const personnelAssignmentIdParamSchema = z.object({
  assignmentId: z.coerce.number().int().positive(),
});

export type CreatePersonnelInput = z.infer<typeof createPersonnelSchema>;
export type UpdatePersonnelInput = z.infer<typeof updatePersonnelSchema>;
export type CreatePersonnelAssignmentInput = z.infer<
  typeof createPersonnelAssignmentSchema
>;
export type UpdatePersonnelAssignmentInput = z.infer<
  typeof updatePersonnelAssignmentSchema
>;
export type CreatePersonnelAssignmentFlatInput = z.infer<
  typeof createPersonnelAssignmentFlatSchema
>;

export interface Personnel {
  personnel_id: number;
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
  role: string;
  mandate: string;
}

export interface PersonnelAssignment {
  assignment_id: number;
  personnel_id: number;
  location_id: number;
  start_date: string;
  end_date: string | null;
}

export interface PersonnelAssignmentWithLocation extends PersonnelAssignment {
  location_name: string;
}
