import { api } from "./api";

export type ReportName = "locations_with_fifa_players"
    |"primary_family_fifa"
    |"formation_details"
    |"five_fifa_games"
    |"formation_summary"
    |"active_unassigned_fifa"
    |"major_since_minor"
    |"goalkeepers_only"
    |"all_five_roles"
    |"family_head_coaches"
    |"never_won"
    |"volunteer_family_fifa";

export async function runReport<T=Record<string,unknown>>(name:ReportName):Promise<T[]> { 
    return api.get<T[]>(`/api/reports/${name}`); 
}

export const reports= {
    locationsWithFifaPlayers:()=>runReport("locations_with_fifa_players"),
    primaryFamilyFifa:()=>runReport("primary_family_fifa"),
    formationDetails:(_locationId:number,_from:string,_to:string)=>runReport("formation_details"),
    fiveFifaGames:()=>runReport("five_fifa_games"),
    formationSummary:(_from:string,_to:string)=>runReport("formation_summary"),
    activeUnassignedFifa:()=>runReport("active_unassigned_fifa"),
    majorSinceMinor:()=>runReport("major_since_minor"),
    goalkeepersOnly:()=>runReport("goalkeepers_only"),
    allFiveRoles:()=>runReport("all_five_roles"),
    familyHeadCoaches:(_locationId:number)=>runReport("family_head_coaches"),
    neverWon:()=>runReport("never_won"),
    volunteerFamilyFifa:()=>runReport("volunteer_family_fifa")
};
