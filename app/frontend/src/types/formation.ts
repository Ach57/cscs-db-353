export type SessionNature="Training"|"Game";

export type PlayerRole="Goalkeeper"|"Right fullback"|"Left fullback"|"Center back"|"Sweeper"|"Defending"|"Right midfielder"|"Central midfielder"|"Striker"|"Attacking midfielder"|"Left winger";

export interface TeamFormation { 
    formation_id:number; 
    location_id:number; 
    team_name:string; 
    opponent_team_name:string|null; 
    head_coach_id:number; 
    session_nature:SessionNature; 
    session_start:string; 
    address:string; 
    score:number|null; 
    opponent_score:number|null; 
    gender:"Boys"|"Girls"; 
}

export type TeamFormationInput=Omit<TeamFormation,"formation_id">;

export interface FormationPlayer { 
    formation_player_id:number; 
    formation_id:number; 
    membership_number:number; 
    player_role:PlayerRole; 
}
