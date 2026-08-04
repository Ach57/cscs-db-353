import { api } from "./api";
export interface EmailLog { 
    email_log_id:number; 
    email_date:string; 
    sender:string; 
    receiver:string; 
    subject:string; 
    body_preview:string; 
}

export const listEmailLogs = () => api.get<EmailLog[]>("/api/emails");
export const generateUpcomingEmailRows = (weekStart:string) => api.post<number>("/api/emails/generate",{week_start:weekStart});
