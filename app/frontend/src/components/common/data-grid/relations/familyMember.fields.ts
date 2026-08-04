import type { ColDef } from "ag-grid-community";
import type { FamilyMember } from "../../../../types/member";

export const familyMemberFields: ColDef<FamilyMember>[] = [
  {
    field: "family_member_id",
    headerName: "Family Member ID",
    minWidth: 180,
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
    field: "address",
    headerName: "Address",
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
    field: "postal_code",
    headerName: "Postal Code",
  },
];