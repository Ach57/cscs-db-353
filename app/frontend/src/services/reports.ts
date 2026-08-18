import { api } from "./api";
export interface ReportResult { id:number; status:string; params:Record<string,unknown>; rows:Record<string,unknown>[]; message?:string; }
export const getReportCatalog = () => api.get<{id:number;status:string;description:string}[]>("/reports");
export const runReport = (id:number, params:Record<string,string>={}) => {
  const query = new URLSearchParams(params).toString();
  return api.get<ReportResult>(`/reports/${id}${query?`?${query}`:""}`);
};
