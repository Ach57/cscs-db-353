import type { ColDef } from "ag-grid-community";
import type { Personnel } from "../types/personnel";

export const personnelFields: ColDef<Personnel>[] = [
  {
    field: "personnel_id",
    headerName: "Personnel ID",
    width: 130,
    flex: 0,
  },
  {
    field: "first_name",
    headerName: "First Name",
  },
  {
    field: "last_name",
    headerName: "Last Name",
  },
  {
    field: "date_of_birth",
    headerName: "Date of Birth",
    filter: "agDateColumnFilter",
  },
  {
    field: "phone_number",
    headerName: "Phone",
  },
  {
    field: "email",
    headerName: "Email",
  },
  {
    field: "city",
    headerName: "City",
  },
  {
    field: "province",
    headerName: "Province",
  },
  {
    field: "role",
    headerName: "Role",
  },
  {
    field: "mandate",
    headerName: "Mandate",
  },
];