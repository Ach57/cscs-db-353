import { z } from 'zod';

export const reportIdParamSchema = z.object({ id: z.coerce.number().int().min(8).max(19) });
export const reportQuerySchema = z.object({
  location_id: z.coerce.number().int().positive().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
