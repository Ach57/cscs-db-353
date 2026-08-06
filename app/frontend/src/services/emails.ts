import { api } from "./api";

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

export interface GeneratedEmail {
  membership_number: number;
  formation_id: number;
  receiver_email: string;
  sender_name: string;
  subject: string;
  body: string;
  body_snippet: string;
}

export interface GenerateWeeklyResult {
  generated_count: number;
  persisted: boolean;
  emails: GeneratedEmail[];
}

export const listEmailLogs = () => api.get<EmailLog[]>("/email-logs");
export const generateWeeklyEmails = (from_date?: string, persist = true) =>
  api.post<GenerateWeeklyResult>("/email-logs/generate-weekly", { ...(from_date ? { from_date } : {}), persist });
