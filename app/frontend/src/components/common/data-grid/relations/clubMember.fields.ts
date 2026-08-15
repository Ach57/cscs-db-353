import type { ColDef } from 'ag-grid-community';
import type { ClubMember } from '../../../../types/member';

export const clubMemberFields: ColDef<ClubMember>[] = [
  {
    field: 'membership_number',
    headerName: 'Membership Number',
    minWidth: 180,
  },
  {
    field: 'location_id',
    headerName: 'Location ID',
  },
  {
    field: 'first_name',
    headerName: 'First Name',
  },
  {
    field: 'last_name',
    headerName: 'Last Name',
  },
  {
    field: 'date_of_birth',
    headerName: 'Date of Birth',
    filter: 'agDateColumnFilter',
  },
  {
    field: 'gender',
    headerName: 'Gender',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['Male', 'Female'] },
  },
  {
    field: 'registration_date',
    headerName: 'Registration Date',
    filter: 'agDateColumnFilter',
  },
  {
    field: 'height_cm',
    headerName: 'Height (cm)',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'weight_kg',
    headerName: 'Weight (kg)',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'phone_number',
    headerName: 'Phone',
  },
  {
    field: 'email',
    headerName: 'Email',
  },
  {
    field: 'family_member_id',
    headerName: 'Linked Family Member ID',
    minWidth: 220,
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'relationship_type',
    headerName: 'Relationship',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: [
        'Father',
        'Mother',
        'Grandfather',
        'Grandmother',
        'Tutor',
        'Partner',
        'Friend',
        'Other',
      ],
    },
  },
  {
    field: 'family_member_type',
    headerName: 'Family Member Type',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['Primary', 'Secondary'] },
  },
];
