import type { ColDef } from "ag-grid-community";
import type { TeamFormation } from "../../../../types/formation";
export const teamFormationFields: ColDef<TeamFormation>[] = [
 {field:"formation_id",headerName:"Formation ID",editable:false},
 {field:"session_id",headerName:"Session ID"}, {field:"location_id",headerName:"Location ID"},
 {field:"head_coach_id",headerName:"Head Coach ID"}, {field:"team_name",headerName:"Team",minWidth:180},
 {field:"score",headerName:"Score",filter:"agNumberColumnFilter"},
 {field:"team_category",headerName:"Category",cellEditor:"agSelectCellEditor",cellEditorParams:{values:["Boys","Girls"]}},
];
