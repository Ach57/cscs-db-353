import { api } from "./api";
export interface EmailLog { email_id:number; email_date:string; membership_number:number; formation_id:number; subject:string; body_snippet:string; }
export const listEmailLogs = () => api.get<EmailLog[]>("/email-logs");
export const generateWeeklyEmails = (from_date?:string,persist=true) => api.post<unknown[]>("/email-logs/generate-weekly",{...(from_date?{from_date}:{}),persist});
