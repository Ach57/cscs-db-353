import { createCrudApi } from "./crudApi";
import { createLocalStorageCrudApi } from "./localStorageCrudApi";
import type { ClubMember, ClubMemberInput, FamilyMember, FamilyMemberInput } from "../types/member";

const familySeed: FamilyMember[] = [
  {
    family_member_id: 1,
    first_name: "Marc",
    last_name: "Roy",
    date_of_birth: "1978-09-20",
    ssn: "222-333-444",
    medicare_number: "ROYM78092001",
    phone_number: "514-555-4100",
    address: "44 Family Street",
    city: "Laval",
    province: "QC",
    postal_code: "H7N 1A1",
    email: "marc.roy@example.ca",
  },
];

const familyMockApi = createLocalStorageCrudApi<FamilyMember, FamilyMemberInput, FamilyMemberInput>({
  storageKey: "cscs.familyMembers",
  idField: "family_member_id",
  seed: familySeed,
  fromCreate: (input, id) => ({ family_member_id: id, ...input }),
});

const familyRealApi = createCrudApi<FamilyMember, FamilyMemberInput, FamilyMemberInput>("/api/family-members");
export const familyMemberApi = import.meta.env.VITE_USE_MOCK_API === "false"
  ? familyRealApi
  : familyMockApi;

export const clubMemberApi = createCrudApi<ClubMember, ClubMemberInput>("/api/club-members");
