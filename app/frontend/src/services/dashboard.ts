import { api } from "./api";
export interface DashboardStats { locations:number; personnel:number; club_members:number; active_members:number; upcoming_sessions:number; unpaid_members:number; }
export const getDashboardStats = () => api.get<DashboardStats>("/api/dashboard/stats");
