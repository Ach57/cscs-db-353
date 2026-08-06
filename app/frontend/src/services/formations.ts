import { api } from "./api";
import { createCrudApi } from "./crudApi";
import type { FormationPlayer, PlayerRole, Session, SessionInput, TeamFormation, TeamFormationInput } from "../types/formation";
export const sessionApi = createCrudApi<Session, SessionInput, Partial<SessionInput>>("/sessions");
export const formationApi = createCrudApi<TeamFormation, TeamFormationInput, Partial<TeamFormationInput>>("/formations");
export const getFormation = (id:number) => api.get<TeamFormation & {assignments:FormationPlayer[]}>(`/formations/${id}`);
export const assignPlayer = (formationId:number,membership_number:number,role:PlayerRole) => api.post<FormationPlayer>(`/formations/${formationId}/assignments`,{membership_number,role});
export const updatePlayerAssignment = (formationId:number,membershipNumber:number,role:PlayerRole) => api.put<FormationPlayer>(`/formations/${formationId}/assignments/${membershipNumber}`,{role});
export const removePlayerAssignment = (formationId:number,membershipNumber:number) => api.delete(`/formations/${formationId}/assignments/${membershipNumber}`);
