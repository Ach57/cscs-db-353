import { api } from "./api";
import type { ClubMember,ClubMemberInput,FamilyMember,FamilyMemberInput,FamilyRelation } from "../types/member";

export const listClubMembers = () => api.get<ClubMember[]>("/api/club-members");

export const getClubMember = (id:number) => api.get<ClubMember>(`/api/club-members/${id}`);

export const createClubMember = (input:ClubMemberInput) => api.post<ClubMember>("/api/club-members",input);

export const updateClubMember = (id:number,input:Partial<ClubMemberInput>) => api.put<ClubMember>(`/api/club-members/${id}`,input);

export const deleteClubMember = (id:number) => api.delete(`/api/club-members/${id}`);

export const listFamilyMembers = () => api.get<FamilyMember[]>("/api/family-members");

export const getFamilyMember = (id:number) => api.get<FamilyMember>(`/api/family-members/${id}`);

export const createFamilyMember = (input:FamilyMemberInput) => api.post<FamilyMember>("/api/family-members",input);

export const updateFamilyMember = (id:number,input:Partial<FamilyMemberInput>) => api.put<FamilyMember>(`/api/family-members/${id}`,input);

export const deleteFamilyMember = (id:number) => api.delete(`/api/family-members/${id}`);

export const linkFamilyMember = (input:Omit<FamilyRelation,"relation_id">) => api.post<FamilyRelation>("/api/family-relations",input);

export const endFamilyRelation = (id:number,end_date:string) => api.put<FamilyRelation>(`/api/family-relations/${id}/end`,{end_date});

export const setMemberHobbies = (id:number,hobbyIds:number[]) => api.put<void>(`/api/club-members/${id}/hobbies`,{hobby_ids:hobbyIds});
