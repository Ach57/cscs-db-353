import type { ColDef } from 'ag-grid-community';
import type { FamilyMember } from '../../../../types/member';

export const familyMemberFields: ColDef<FamilyMember>[] = [
  {
    field: 'family_member_id',
    headerName: 'Family Member ID',
    minWidth: 180,
    editable: false,
  },
  { field: 'first_name', headerName: 'First Name', minWidth: 145 },
  { field: 'last_name', headerName: 'Last Name', minWidth: 145 },
  { field: 'date_of_birth', headerName: 'Date of Birth', minWidth: 155 },
  { field: 'ssn', headerName: 'SSN', minWidth: 150 },
  { field: 'medicare_number', headerName: 'Medicare Number', minWidth: 185 },
  { field: 'phone_number', headerName: 'Phone', minWidth: 155 },
  { field: 'email', headerName: 'Email', minWidth: 220 },
  { field: 'address', headerName: 'Address', minWidth: 190 },
  { field: 'city', headerName: 'City', minWidth: 140 },
  { field: 'province', headerName: 'Province', minWidth: 125 },
  { field: 'postal_code', headerName: 'Postal Code', minWidth: 145 },
];
