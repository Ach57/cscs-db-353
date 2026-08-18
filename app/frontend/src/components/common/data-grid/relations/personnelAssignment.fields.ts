import type { ColDef } from "ag-grid-community";
import type {
  PersonnelAssignment,
} from "../../../../types/personnel";

export const personnelAssignmentFields: ColDef<PersonnelAssignment>[] = [
  {
    field: "assignment_id",
    headerName: "Assignment ID",
    editable: false,
    minWidth: 150,
  },
  {
    field: "personnel_id",
    headerName: "Personnel ID",
    minWidth: 140,
    filter: "agNumberColumnFilter",
  },
  {
    field: "location_id",
    headerName: "Location ID",
    minWidth: 130,
    filter: "agNumberColumnFilter",
  },
  {
    field: "location_name",
    headerName: "Location",
    editable: false,
    minWidth: 160,
  },
  {
    field: "start_date",
    headerName: "Start Date",
    minWidth: 140,
    filter: "agDateColumnFilter",
  },
  {
    field: "end_date",
    headerName: "End Date",
    minWidth: 140,
    filter: "agDateColumnFilter",
  },
];