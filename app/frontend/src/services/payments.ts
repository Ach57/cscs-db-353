import { api } from "./api";
import type { Payment,PaymentInput,MembershipBalance } from "../types/payment";
import { createCrudApi } from "./crudApi";

export const listPayments = (membershipNumber?:number) => api.get<Payment[]>(`/api/payments${membershipNumber ? `?membership_number=${membershipNumber}` : ""}`);

export const makePayment = (input:PaymentInput) => api.post<Payment>("/api/payments",input);

export const updatePayment = (id:number,input:Partial<PaymentInput>) => api.put<Payment>(`/api/payments/${id}`,input);

export const deletePayment = (id:number) => api.delete(`/api/payments/${id}`);

export const getMembershipBalance = (id:number,year:number) => api.get<MembershipBalance>(`/api/club-members/${id}/balance?year=${year}`);

export type CreatePaymentInput =
  Omit<Payment, "payment_id">;

export const paymentApi =
  createCrudApi<Payment, CreatePaymentInput>(
    "/api/payments",
  );