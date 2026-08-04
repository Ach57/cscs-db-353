import { api } from "./api";
import type { TeamFormation,TeamFormationInput,FormationPlayer,PlayerRole } from "../types/formation";

export const listFormations = (_from?:string,_to?:string,_locationId?:number) => api.get<TeamFormation[]>("/api/formations");

export const getFormation = (id:number) =>   api.get<TeamFormation>(`/api/formations/${id}`);

export const createFormation = (input:TeamFormationInput) => api.post<TeamFormation>("/api/formations",input);

export const updateFormation = (id:number,input:Partial<TeamFormationInput>) => api.put<TeamFormation>(`/api/formations/${id}`,input);

export const deleteFormation = (id:number) => api.delete(`/api/formations/${id}`);

export const assignPlayer = (formation_id:number,membership_number:number,player_role:PlayerRole) => 
    api.post<FormationPlayer>(`/api/formations/${formation_id}/players`,{membership_number,player_role});

export const updatePlayerAssignment = (id:number,player_role:PlayerRole) => 
    api.put<FormationPlayer>(`/api/formations/players/${id}`,{player_role});

export const removePlayerAssignment = (id:number) => api.delete(`/api/formations/players/${id}`);

export const listFormationPlayers = (id:number) => api.get<FormationPlayer[]>(`/api/formations/${id}/players`);

import { createCrudApi } from "./crudApi";

export const formationApi = createCrudApi<TeamFormation, TeamFormationInput>(
  "/api/formations",
);
