import { z } from 'zod';

export const createFIFAGameSchema = z.object({
  location_id: z.number().int().positive(),
  team_name: z.string().min(1).max(100),
  opponent_name: z.string().min(1).max(100),
  game_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  team_score: z.number().int().min(0),
  opponent_score: z.number().int().min(0),
});

export const updateFIFAGameSchema = createFIFAGameSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  });

export const gameIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const addParticipantSchema = z.object({
  membership_number: z.number().int().positive(),
});

// Combined schema for routes with both :id (game) and :membershipNumber
export const gameParticipantParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  membershipNumber: z.coerce.number().int().positive(),
});

export type CreateFIFAGameInput = z.infer<typeof createFIFAGameSchema>;
export type UpdateFIFAGameInput = z.infer<typeof updateFIFAGameSchema>;
export type AddParticipantInput = z.infer<typeof addParticipantSchema>;

export interface FIFAGame {
  game_id: number;
  location_id: number;
  team_name: string;
  opponent_name: string;
  game_date: string;
  team_score: number;
  opponent_score: number;
}

export interface FIFAParticipant {
  game_id: number;
  membership_number: number;
  first_name: string;
  last_name: string;
}

export interface FIFAGameWithParticipants extends FIFAGame {
  participants: FIFAParticipant[];
}
