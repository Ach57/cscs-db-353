import { z } from 'zod';

export const createEmailLogSchema = z.object({
  email_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  membership_number: z.number().int().positive(),
  formation_id: z.number().int().positive(),
  subject: z.string().min(1).max(150),
  body_snippet: z.string().min(1).max(100),
});

export const emailIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateEmailLogInput = z.infer<typeof createEmailLogSchema>;

export interface EmailLog {
  email_id: number;
  email_date: string;
  membership_number: number;
  formation_id: number;
  subject: string;
  body_snippet: string;
  sender_name?: string;
  receiver_email?: string;
  receiver_first_name?: string;
  receiver_last_name?: string;
  team_name?: string;
}


export const generateWeeklyEmailsSchema = z.object({
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  persist: z.boolean().default(true),
});
export type GenerateWeeklyEmailsInput = z.infer<typeof generateWeeklyEmailsSchema>;
