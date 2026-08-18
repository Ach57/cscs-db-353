import { api } from "./api";
export interface HealthStatus { status:string; database:string; latency_ms:number; }
export const getHealth = () => api.get<HealthStatus>("/health");
