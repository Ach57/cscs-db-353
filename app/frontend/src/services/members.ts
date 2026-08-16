import { createCrudApi } from './crudApi';
import type {
  ClubMember,
  ClubMemberInput,
  FamilyMember,
  FamilyMemberInput,
  FamilyRelation,
  FamilyRelationInput,
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
