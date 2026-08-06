import RelationPage from "../../components/common/relation-page/RelationPage";
import { personnelFields } from "../../components/common/data-grid/relations/personnel.fields";
import type { Personnel, PersonnelInput } from "../../types/personnel";
import { personnelApi } from "../../services/personnel";

const POSTAL_CODE = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanNullable(value: string | null): string | undefined {
  return value?.trim() || undefined;
}

function toInput(row: Personnel): PersonnelInput {
  return {
    first_name: row.first_name.trim(), last_name: row.last_name.trim(),
    date_of_birth: row.date_of_birth, ssn: row.ssn.trim(),
    medicare_number: cleanNullable(row.medicare_number),
    phone_number: cleanNullable(row.phone_number), address: cleanNullable(row.address),
    city: cleanNullable(row.city), province: row.province?.trim().toUpperCase() || undefined,
    postal_code: row.postal_code?.trim().toUpperCase() || undefined,
    email: cleanNullable(row.email), role: row.role, mandate: row.mandate,
  };
}

function validate(row: Personnel): string[] {
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

export default function PersonnelPage() {
  return (
    <RelationPage<Personnel, PersonnelInput, PersonnelInput>
      title="Personnel"
      description="Manage personnel profiles."
      columnDefs={personnelFields}
      api={personnelApi}
      idField="personnel_id"
      getRowId={(row) => String(row.personnel_id)}
      createEmptyRow={() => ({
        personnel_id: -Date.now(), first_name: "", last_name: "", date_of_birth: "",
        ssn: "", medicare_number: null, address: null, postal_code: null,
        phone_number: null, email: null, city: null, province: "QC",
        role: "Other", mandate: "Volunteer",
      })}
      validateRow={validate}
      toCreateInput={toInput}
      toUpdateInput={toInput}
    />
  );
}
