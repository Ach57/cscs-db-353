import { api } from "./api";
import type { Payment,PaymentInput,MembershipBalance } from "../types/payment";
import { createCrudApi } from "./crudApi";
export const listPayments = () => api.get<Payment[]>("/payments");
export const makePayment = (input:PaymentInput) => api.post<Payment>("/payments",input);
export const getMembershipBalance = (id:number,year:number) => api.get<MembershipBalance>(`/payments/member/${id}/year/${year}`);
export const paymentApi = createCrudApi<Payment, PaymentInput, Partial<PaymentInput>>("/payments");
