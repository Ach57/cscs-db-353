import RelationPage from '../../components/common/relation-page/RelationPage';
import { familyMemberAssignmentFields } from '../../components/common/data-grid/relations/familyMemberAssignment.fields';
import type {
  FamilyMemberAssignment,
  FamilyMemberAssignmentInput,
} from '../../types/member';
import { FamilyMemberAssignmentApi } from '../../services/members';

function toInput(row: FamilyMemberAssignment): FamilyMemberAssignmentInput {
  return {
    family_member_id: row.family_member_id,
    location_id: row.location_id,
    start_date: row.start_date,
    end_date: row.end_date,
  };
}

function validate(row: FamilyMemberAssignment): string[] {
  const errors: string[] = [];
  if (!row.family_member_id) errors.push('Family Member ID is required.');
  if (!row.location_id) errors.push('Location ID is required.');
  if (!row.start_date) errors.push('You must enter the starting date.');
  if (row.end_date && new Date(row.end_date) < new Date(row.start_date))
    errors.push('End date must be greater than starting date.');
  return errors;
}

export default function FamilyMemberAssignmentOverview() {
  return (
    <RelationPage<
      FamilyMemberAssignment,
      FamilyMemberAssignmentInput,
      FamilyMemberAssignmentInput
    >
      title="Family-Member-Assignment"
      description="Manage personnel assignments."
      columnDefs={familyMemberAssignmentFields}
      api={FamilyMemberAssignmentApi}
      idField="assignment_id"
      getRowId={(row) => String(row.assignment_id)}
      createEmptyRow={() => ({
        assignment_id: -Date.now(),
        family_member_id: 0,
        location_id: 0,
        location_name: '',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: null,
      })}
      validateRow={validate}
      toCreateInput={toInput}
      toUpdateInput={toInput}
    />
  );
}
