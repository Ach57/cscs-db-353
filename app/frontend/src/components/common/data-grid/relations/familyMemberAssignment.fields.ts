import type { ColDef } from 'ag-grid-community';
import type { FamilyMemberAssignment } from '../../../../types/member';

export const familyMemberAssignmentFields: ColDef<FamilyMemberAssignment>[] = [
  {
    field: 'assignment_id',
    headerName: ' Assignment ID',
    minWidth: 140,
    editable: false,
  },
  {
    field: 'family_member_id',
    headerName: 'Family Member ID',
    minWidth: 140,
  },
  {
    field: 'location_id',
    headerName: 'Location ID',
    minWidth: 140,
  },
  {
    field: 'location_name',
    headerName: 'Location Name',
    minWidth: 140,
    editable: false,
  },
  {
    field: 'start_date',
    headerName: 'Starting Date',
    minWidth: 140,
  },
  {
    field: 'end_date',
    headerName: 'End Date',
    minWidth: 140,
  },
];
