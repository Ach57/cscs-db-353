import { z } from 'zod';

export const paymentMethodEnum = z.enum(['Cash', 'Debit', 'Credit']);

export const createPaymentSchema = z.object({
  membership_number: z.number().int().positive(),
  payment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  amount: z.number().positive(),
  payment_method: paymentMethodEnum,
  membership_year: z.number().int().min(2000).max(2100),
  installment_number: z.number().int().min(1).max(4).default(1),
});

export const paymentIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export interface Payment {
  payment_id: number;
  membership_number: number;
  payment_date: string;
  amount: number;
  payment_method: string;
  membership_year: number;
  installment_number: number;
}
