import { api } from "./api";
import type { Personnel,PersonnelInput,PersonnelAssignment } from "../types/personnel";

export const listPersonnel = () => api.get<Personnel[]>("/api/personnel");

export const getPersonnel = (id:number) => api.get<Personnel>(`/api/personnel/${id}`);

export const createPersonnel = (input:PersonnelInput) => api.post<Personnel>("/api/personnel",input);

export const updatePersonnel = (id:number,input:Partial<PersonnelInput>) => api.put<Personnel>(`/api/personnel/${id}`,input);

export const deletePersonnel = (id:number) => api.delete(`/api/personnel/${id}`);

export const assignPersonnel = (input:Omit<PersonnelAssignment,"assignment_id">) => api.post<PersonnelAssignment>("/api/personnel/assignments",input);

export const endPersonnelAssignment = (id:number,end_date:string) => api.put<PersonnelAssignment>(`/api/personnel/assignments/${id}/end`,{end_date});

export const listPersonnelAssignments = (id:number) => api.get<PersonnelAssignment[]>(`/api/personnel/${id}/assignments`);
