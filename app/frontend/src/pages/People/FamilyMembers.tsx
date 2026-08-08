import RelationPage from "../../components/common/relation-page/RelationPage";
import { familyMemberFields } from "../../components/common/data-grid/relations/familyMember.fields";
import type { FamilyMember, FamilyMemberInput } from "../../types/member";
import { familyMemberApi } from "../../services/members";

const POSTAL_CODE = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanNullable(value: string | null): string | undefined {
  return value?.trim() || undefined;
}

function toInput(row: FamilyMember): FamilyMemberInput {
  return {
    first_name: row.first_name.trim(), last_name: row.last_name.trim(),
    date_of_birth: row.date_of_birth, ssn: row.ssn.trim(),
    medicare_number: cleanNullable(row.medicare_number),
    phone_number: cleanNullable(row.phone_number), address: cleanNullable(row.address),
    city: cleanNullable(row.city), province: row.province?.trim().toUpperCase() || undefined,
    postal_code: row.postal_code?.trim().toUpperCase() || undefined,
    email: cleanNullable(row.email),
  };
}

function validate(row: FamilyMember): string[] {
  const errors: string[] = [];
  if (!row.first_name.trim()) errors.push("First name is required.");
  if (!row.last_name.trim()) errors.push("Last name is required.");
  if (!row.date_of_birth) errors.push("Date of birth is required.");
  else if (new Date(row.date_of_birth) >= new Date()) errors.push("Date of birth must be in the past.");
  if (!row.ssn.trim()) errors.push("SSN is required.");
  if (row.email && !EMAIL.test(row.email.trim())) errors.push("Email address is invalid.");
  if (row.postal_code && !POSTAL_CODE.test(row.postal_code.trim())) errors.push("Postal code is invalid.");
  return errors;
}

export default function FamilyMembers() {
  return (
    <RelationPage<FamilyMember, FamilyMemberInput, FamilyMemberInput>
      title="Family Members"
      description="Manage family member profiles."
      columnDefs={familyMemberFields}
      api={familyMemberApi}
      idField="family_member_id"
      getRowId={(row) => String(row.family_member_id)}
      createEmptyRow={() => ({
        family_member_id: -Date.now(), first_name: "", last_name: "", date_of_birth: "",
        ssn: "", medicare_number: null, phone_number: null, email: null,
        address: null, city: null, province: "QC", postal_code: null,
      })}
      validateRow={validate}
      toCreateInput={toInput}
      toUpdateInput={toInput}
    />
  );
}
