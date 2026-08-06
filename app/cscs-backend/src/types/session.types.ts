import { z } from 'zod';

export const sessionTypeEnum = z.enum(['Training', 'Game']);
export const teamCategoryEnum = z.enum(['Boys', 'Girls']);

export const formationRoleEnum = z.enum([
  'Goalkeeper',
  'Right Fullback',
  'Left Fullback',
  'Center Back',
  'Center Back or Sweeper',
  'Defending or Holding Midfielder',
  'Right Midfielder or Winger',
  'Central Midfielder',
  'Striker',
  'Attacking Midfielder',
  'Left Winger',
]);

export const createSessionSchema = z.object({
  session_datetime: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}(:\d{2})?)?$/, 'Must be YYYY-MM-DD or YYYY-MM-DD HH:MM:SS'),
  address: z.string().min(1).max(150),
  session_type: sessionTypeEnum,
});

export const updateSessionSchema = createSessionSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  });

export const sessionIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createFormationSchema = z.object({
  session_id: z.number().int().positive(),
  location_id: z.number().int().positive(),
  head_coach_id: z.number().int().positive(),
  team_name: z.string().min(1).max(100),
  score: z.number().int().min(0).optional(),
  team_category: teamCategoryEnum,
});

export const updateFormationSchema = createFormationSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  });

export const formationIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const addFormationMemberSchema = z.object({
  membership_number: z.number().int().positive(),
  role: formationRoleEnum,
});

export const updateFormationMemberSchema = z.object({
  role: formationRoleEnum,
});

// Combined schema for routes with both :id (formation) and :membershipNumber
export const formationMemberParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  membershipNumber: z.coerce.number().int().positive(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateFormationInput = z.infer<typeof createFormationSchema>;
export type UpdateFormationInput = z.infer<typeof updateFormationSchema>;
export type AddFormationMemberInput = z.infer<typeof addFormationMemberSchema>;
export type UpdateFormationMemberInput = z.infer<typeof updateFormationMemberSchema>;

export interface Session {
  session_id: number;
  session_datetime: string;
  address: string;
  session_type: string;
}

export interface TeamFormation {
  formation_id: number;
  session_id: number;
  location_id: number;
  head_coach_id: number;
  team_name: string;
  score: number | null;
  team_category: string;
}

export interface TeamFormationAssignment {
  formation_id: number;
  membership_number: number;
  role: string;
}

export interface TeamFormationWithAssignments extends TeamFormation {
  assignments: (TeamFormationAssignment & { first_name: string; last_name: string })[];
}

export interface SessionWithFormations extends Session {
  formations: TeamFormation[];
}
