import RelationPage from '../../components/common/relation-page/RelationPage';
import { personnelAssignmentFields } from '../../components/common/data-grid/relations';
import type {
  PersonnelAssignment,
  PersonnelAssignmentInput,
} from '../../types/personnel';
import { personnelAssignmentApi } from '../../services/personnel';

function toInput(row: PersonnelAssignment): PersonnelAssignmentInput {
  return {
    personnel_id: row.personnel_id,
    location_id: row.location_id,
    start_date: row.start_date,
    end_date: row.end_date,
  };
}

function validate(row: PersonnelAssignment): string[] {
  const errors: string[] = [];
  if (!row.personnel_id) errors.push('Personnel ID is required.');
  if (!row.location_id) errors.push('Location ID is required.');
  if (!row.start_date) errors.push('You must enter the starting date.');
  if (row.end_date && new Date(row.end_date) < new Date(row.start_date))
    errors.push('End date must be greater than starting date.');
  return errors;
}

export default function PersonnelAssignmentsOverview() {
  return (
    <RelationPage<
      PersonnelAssignment,
      PersonnelAssignmentInput,
      PersonnelAssignmentInput
    >
      title="Personnel-Assignment"
      description="Manage personnel assignments."
      columnDefs={personnelAssignmentFields}
      api={personnelAssignmentApi}
      idField="assignment_id"
      getRowId={(row) => String(row.assignment_id)}
      createEmptyRow={() => ({
        assignment_id: -Date.now(),
        personnel_id: 0,
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
