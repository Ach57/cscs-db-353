import type { ColDef } from "ag-grid-community";
import type { FormationPlayer } from "../../../../types/formation";

export const formationPlayerFields: ColDef<FormationPlayer>[] = [
  {
    field: "formation_player_id",
    headerName: "Formation Player ID",
    minWidth: 190,
  },
  {
    field: "formation_id",
    headerName: "Formation ID",
  },
  {
    field: "membership_number",
    headerName: "Membership Number",
    minWidth: 180,
  },
  {
    field: "player_role",
    headerName: "Player Role",
  },
];