import type { ColDef } from "ag-grid-community";
import type { FamilyRelation } from "../../../../types/member";

export const familyRelationFields: ColDef<FamilyRelation>[] = [
  {
    field: "relation_id",
    headerName: "Relation ID",
  },
  {
    field: "membership_number",
    headerName: "Membership Number",
    minWidth: 180,
  },
  {
    field: "family_member_id",
    headerName: "Family Member ID",
    minWidth: 170,
  },
  {
    field: "relationship_type",
    headerName: "Relationship",
  },
  {
    field: "start_date",
    headerName: "Start Date",
  },
  {
    field: "end_date",
    headerName: "End Date",
  },
  {
    field: "is_primary",
    headerName: "Primary Contact",
    valueFormatter: ({ value }) => (value ? "Yes" : "No"),
  },
];