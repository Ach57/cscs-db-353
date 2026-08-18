import type { ColDef } from "ag-grid-community";
import type { FormationPlayer } from "../../../../types/formation";
export const formationPlayerFields: ColDef<FormationPlayer>[] = [
 {field:"formation_id",headerName:"Formation ID",editable:false},
 {field:"membership_number",headerName:"Membership Number",editable:false,minWidth:180},
 {field:"first_name",headerName:"First Name",editable:false}, {field:"last_name",headerName:"Last Name",editable:false},
 {field:"role",headerName:"Player Role",minWidth:220},
];
