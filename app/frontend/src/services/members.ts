import { createCrudApi } from './crudApi';
import {
  type ClubMember,
  type ClubMemberInput,
  type FamilyMember,
  type FamilyMemberInput,
  type FamilyRelation,
  type FamilyRelationInput,
  type FamilyMemberAssignment,
  type FamilyMemberAssignmentInput,
} from '../types/member';
export const familyMemberApi = createCrudApi<
  FamilyMember,
  FamilyMemberInput,
  Partial<FamilyMemberInput>
>('/family-members');
export const clubMemberApi = createCrudApi<
  ClubMember,
  ClubMemberInput,
  Partial<ClubMemberInput>
>('/club-members');
export const familyRelationApi = createCrudApi<
  FamilyRelation,
  FamilyRelationInput,
  Partial<FamilyRelationInput>
>('/club-members/family-relations');
export const FamilyMemberAssignmentApi = createCrudApi<
  FamilyMemberAssignment,
  FamilyMemberAssignmentInput,
  Partial<FamilyMemberAssignmentInput>
>('/family-members/family-members-assignment');
