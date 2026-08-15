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
    filter: "agNumberColumnFilter",
  },
  {
    field: "family_member_id",
    headerName: "Family Member ID",
    minWidth: 170,
    filter: "agNumberColumnFilter",
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
    field: "relationship_type",
    headerName: "Relationship",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: [
        "Father",
        "Mother",
        "Grandfather",
        "Grandmother",
        "Tutor",
        "Partner",
        "Friend",
        "Other",
      ],
    },
  },
  {
    field: "family_member_type",
    headerName: "Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Primary", "Secondary"] },
  },
  {
    field: "start_date",
    headerName: "Start Date",
    filter: "agDateColumnFilter",
  },
  {
    field: "end_date",
    headerName: "End Date",
    filter: "agDateColumnFilter",
  },
];