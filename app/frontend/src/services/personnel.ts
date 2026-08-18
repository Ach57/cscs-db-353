import { createCrudApi } from './crudApi';
import type {
  Personnel,
  PersonnelInput,
  PersonnelAssignment,
  PersonnelAssignmentInput,
} from '../types/personnel';
export const personnelApi = createCrudApi<
  Personnel,
  PersonnelInput,
  Partial<PersonnelInput>
>('/personnel');
export const personnelAssignmentApi = createCrudApi<
  PersonnelAssignment,
  PersonnelAssignmentInput
>('/personnel/personnel-assignment');
