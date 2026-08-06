import { createCrudApi } from "./crudApi";
import type { ClubMember, ClubMemberInput, FamilyMember, FamilyMemberInput } from "../types/member";
export const familyMemberApi = createCrudApi<FamilyMember, FamilyMemberInput, Partial<FamilyMemberInput>>("/family-members");
export const clubMemberApi = createCrudApi<ClubMember, ClubMemberInput, Partial<ClubMemberInput>>("/club-members");
