import type { ColDef } from "ag-grid-community";
import type { TeamFormation } from "../../../../types/formation";
export const teamFormationFields: ColDef<TeamFormation>[] = [
 {field:"formation_id",headerName:"Formation ID",editable:false},
 {field:"session_id",headerName:"Session ID"}, {field:"session_datetime",headerName:"Session Date/Time",editable:false,minWidth:190},
 {field:"session_type",headerName:"Session Type",editable:false}, {field:"location_id",headerName:"Location ID"},
 {field:"location_name",headerName:"Location",editable:false,minWidth:160},
 {field:"head_coach_id",headerName:"Head Coach ID"},
 {headerName:"Head Coach",editable:false,minWidth:180,valueGetter:({data})=>data?[data.coach_first_name,data.coach_last_name].filter(Boolean).join(" "):""},
 {field:"team_name",headerName:"Team",minWidth:180},
 {field:"score",headerName:"Score",filter:"agNumberColumnFilter"},
 {field:"player_count",headerName:"Players",editable:false,filter:"agNumberColumnFilter"},
 {field:"team_category",headerName:"Category",cellEditor:"agSelectCellEditor",cellEditorParams:{values:["Boys","Girls"]}},
];
