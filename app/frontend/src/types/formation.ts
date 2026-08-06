export type SessionNature = "Training" | "Game";
export type TeamCategory = "Boys" | "Girls";
export type PlayerRole = "Goalkeeper"|"Right Fullback"|"Left Fullback"|"Center Back"|"Center Back or Sweeper"|"Defending or Holding Midfielder"|"Right Midfielder or Winger"|"Central Midfielder"|"Striker"|"Attacking Midfielder"|"Left Winger";

export interface Session { session_id:number; session_datetime:string; address:string; session_type:SessionNature; }
export type SessionInput = Omit<Session,"session_id">;
export interface TeamFormation { formation_id:number; session_id:number; location_id:number; head_coach_id:number; team_name:string; score:number|null; team_category:TeamCategory; session_datetime?:string; session_type?:SessionNature; session_address?:string; location_name?:string; coach_first_name?:string; coach_last_name?:string; player_count?:number; assignments?:FormationPlayer[]; }
export type TeamFormationInput=Omit<TeamFormation,"formation_id">;
export interface FormationPlayer { formation_id:number; membership_number:number; role:PlayerRole; first_name?:string; last_name?:string; }

export interface MemberAssignmentOverview { membership_number:number; first_name:string; last_name:string; location_id:number; location_name:string; assignment_count:number; assigned_teams:string|null; }
