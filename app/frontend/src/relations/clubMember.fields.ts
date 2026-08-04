import type { ColDef } from "ag-grid-community";
import type { ClubMember } from "../types/member";

export const clubMemberFields: ColDef<ClubMember>[] = [
  {
    field: "membership_number",
    headerName: "Membership Number",
    minWidth: 180,
  },
  {
    field: "location_id",
    headerName: "Location ID",
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
    field: "registration_date",
    headerName: "Registration Date",
    filter: "agDateColumnFilter",
  },
  {
    field: "height_cm",
    headerName: "Height (cm)",
    filter: "agNumberColumnFilter",
  },
  {
    field: "weight_kg",
    headerName: "Weight (kg)",
    filter: "agNumberColumnFilter",
  },
  {
    field: "phone_number",
    headerName: "Phone",
  },
  {
    field: "email",
    headerName: "Email",
  },
];