export type PaymentMethod="Cash"|"Debit"|"Credit";

export interface Payment { 
    payment_id:number; 
    membership_number:number; 
    payment_date:string; 
    amount:number; 
    payment_method:PaymentMethod; 
    membership_year:number; 
    installment_number:number; 
}
export type PaymentInput=Omit<Payment,"payment_id">;

export interface MembershipBalance { 
    membership_number:number; 
    membership_year:number; 
    required_fee:number; 
    total_paid:number; 
    donation:number; 
    balance_due:number; 
    status:"Active"|"Inactive"; 
}
