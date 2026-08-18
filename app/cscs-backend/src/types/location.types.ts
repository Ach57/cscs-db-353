import { z } from 'zod';

export const locationTypeEnum = z.enum(['Head', 'Branch']);

export const createLocationSchema = z.object({
  location_type: locationTypeEnum,
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(150),
  city: z.string().min(1).max(60),
  province: z.string().length(2),
  postal_code: z.string().min(1).max(10),
  web_address: z.string().url().max(200).optional(),
  capacity: z.number().int().positive(),
});

// PUT allows updating any subset of fields, but at least one is required
export const updateLocationSchema = createLocationSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const locationIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;

export interface Location {
  location_id: number;
  location_type: 'Head' | 'Branch';
  name: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  web_address: string | null;
  capacity: number;
}


export const locationPhoneParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  phoneNumber: z.string().min(1).max(20),
});

export const createLocationPhoneSchema = z.object({
  phone_number: z.string().min(1).max(20),
});

export interface LocationPhone {
  location_id: number;
  phone_number: string;
}
