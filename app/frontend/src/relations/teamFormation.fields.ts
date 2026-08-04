import type { ColDef } from "ag-grid-community";
import type { TeamFormation } from "../types/formation";

export const teamFormationFields: ColDef<TeamFormation>[] = [
  {
    field: "formation_id",
    headerName: "Formation ID",
  },
  {
    field: "location_id",
    headerName: "Location ID",
  },
  {
    field: "team_name",
    headerName: "Team",
  },
  {
    field: "opponent_team_name",
    headerName: "Opponent",
  },
  {
    field: "head_coach_id",
    headerName: "Head Coach ID",
  },
  {
    field: "session_nature",
    headerName: "Session",
  },
  {
    field: "session_start",
    headerName: "Start Time",
  },
  {
    field: "address",
    headerName: "Address",
  },
  {
    field: "score",
    headerName: "Score",
    filter: "agNumberColumnFilter",
  },
  {
    field: "opponent_score",
    headerName: "Opponent Score",
    filter: "agNumberColumnFilter",
  },
  {
    field: "gender",
    headerName: "Team Group",
  },
];