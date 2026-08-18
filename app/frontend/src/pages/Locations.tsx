import RelationPage from "../components/common/relation-page/RelationPage";
import { locationFields } from "../components/common/data-grid/relations/location.fields";
import type { Location, LocationInput } from "../types/location";
import { locationApi } from "../services/locations";

const POSTAL_CODE = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const PHONE = /^[+]?[(]?[0-9]{2,4}[)]?[-\s./0-9]{5,}$/;

function toInput(row: Location): LocationInput {
  return {
    location_type: row.location_type,
    name: row.name.trim(),
    address: row.address.trim(),
    city: row.city.trim(),
    province: row.province.trim().toUpperCase(),
    postal_code: row.postal_code.trim().toUpperCase(),
    web_address: row.web_address?.trim() || null,
    capacity: Number(row.capacity),
    phone_numbers: row.location_phone.map((item) => item.phone_number.trim()).filter(Boolean),
  };
}

function validate(row: Location): string[] {
  const errors: string[] = [];
  if (!row.name.trim()) errors.push("Location name is required.");
  if (!row.address.trim()) errors.push("Address is required.");
  if (!row.city.trim()) errors.push("City is required.");
  if (!row.province.trim()) errors.push("Province is required.");
  if (!POSTAL_CODE.test(row.postal_code.trim())) errors.push("Use a Canadian postal code such as H2X 1A1.");
  if (!Number.isInteger(Number(row.capacity)) || Number(row.capacity) <= 0) errors.push("Capacity must be a whole number greater than zero.");
  if (!row.location_phone.length) errors.push("At least one phone number is required.");
  const invalid = row.location_phone.find((item) => !PHONE.test(item.phone_number.trim()));
  if (invalid) errors.push(`Phone number "${invalid.phone_number}" is invalid.`);
  if (row.web_address?.trim()) {
    try { new URL(row.web_address.trim()); } catch { errors.push("Website must be a complete URL."); }
  }
  return errors;
}

export default function Locations() {
  return (
    <RelationPage<Location, LocationInput, LocationInput>
      title="Locations"
      description="Manage locations."
      columnDefs={locationFields}
      api={locationApi}
      idField="location_id"
      getRowId={(row) => String(row.location_id)}
      createEmptyRow={() => ({
        location_id: -Date.now(), location_type: "Branch", name: "", address: "",
        city: "", province: "QC", postal_code: "", web_address: null,
        capacity: 1, location_phone: [],
      })}
      validateRow={validate}
      toCreateInput={toInput}
      toUpdateInput={toInput}
    />
  );
}
