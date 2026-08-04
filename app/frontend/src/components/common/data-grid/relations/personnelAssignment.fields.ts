import type { ColDef } from "ag-grid-community";
import type {
  PersonnelAssignment,
} from "../../../../types/personnel";

export const personnelAssignmentFields: ColDef<PersonnelAssignment>[] = [
  {
    field: "assignment_id",
    headerName: "Assignment ID",
  },
  {
    field: "personnel_id",
    headerName: "Personnel ID",
  },
  {
    field: "location_id",
    headerName: "Location ID",
  },
  {
    field: "start_date",
    headerName: "Start Date",
  },
  {
    field: "end_date",
    headerName: "End Date",
  },
];