import RelationPage from "../components/common/relation-page/RelationPage";
import { locationFields } from "../components/common/data-grid/relations/location.fields";
import type { Location, LocationInput } from "../types/location";
import { locationApi } from "../services/locations";

const CANADIAN_POSTAL_CODE = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const PHONE_NUMBER = /^[+]?[(]?[0-9]{2,4}[)]?[-\s./0-9]{5,}$/;

function toLocationInput(location: Location): LocationInput {
  return {
    location_type: location.location_type,
    name: location.name.trim(),
    address: location.address.trim(),
    city: location.city.trim(),
    province: location.province.trim().toUpperCase(),
    postal_code: location.postal_code.trim().toUpperCase(),
    web_address: location.web_address?.trim() || null,
    capacity: Number(location.capacity),
    phone_numbers: location.location_phone.map((phone) => phone.phone_number.trim()),
  };
}

function validateLocation(location: Location): string[] {
  const errors: string[] = [];
  const requiredTextFields: Array<[string, string]> = [
    ["Location name", location.name],
    ["Address", location.address],
    ["City", location.city],
    ["Province", location.province],
    ["Postal code", location.postal_code],
  ];

  for (const [label, value] of requiredTextFields) {
    if (!value.trim()) errors.push(`${label} is required.`);
  }

  if (!CANADIAN_POSTAL_CODE.test(location.postal_code.trim())) {
    errors.push("Postal code must use a valid Canadian format, such as H2X 1A1.");
  }

  if (!Number.isInteger(Number(location.capacity)) || Number(location.capacity) <= 0) {
    errors.push("Capacity must be a whole number greater than zero.");
  }

  if (location.location_phone.length === 0) {
    errors.push("At least one phone number is required.");
  }

  const invalidPhone = location.location_phone.find(
    ({ phone_number }) => !PHONE_NUMBER.test(phone_number.trim()),
  );
  if (invalidPhone) errors.push(`Phone number "${invalidPhone.phone_number}" is invalid.`);

  const website = location.web_address?.trim();
  if (website) {
    try {
      new URL(website);
    } catch {
      errors.push("Website must be a complete URL, such as https://example.ca.");
    }
  }

  return errors;
}

export default function Locations() {

  return (
    <RelationPage<Location, LocationInput, LocationInput>
      title="Locations"
      description="Manage club locations."
      initialData={[
  {
    location_phone: [
      { phone_number: "514-555-1000" },
      { phone_number: "514-555-1000" },
    ],
    location_id: 1,
    location_type: "Head",
    name: "Downtown Soccer Centre",
    address: "123 Main St",
    city: "Montreal",
    province: "QC",
    postal_code: "H2X 1A1",
    web_address: "https://downtownsoccer.ca",
    capacity: 450,
  },
  {
    location_phone: [
      { phone_number: "514-555-1000" },
      { phone_number: "514-555-1000" },
    ],
    location_id: 2,
    location_type: "Branch",
    name: "West Island Complex",
    address: "88 Lakeshore Blvd",
    city: "Dorval",
    province: "QC",
    postal_code: "H9S 4B5",
    web_address: "https://westislandsoccer.ca",
    capacity: 300,
  },
  {
    location_phone: [
      { phone_number: "514-555-1000" },
      { phone_number: "514-555-1000" },
    ],
    location_id: 3,
    location_type: "Branch",
    name: "North Sports Centre",
    address: "50 Arena Rd",
    city: "Laval",
    province: "QC",
    postal_code: "H7N 2K3",
    web_address: "https://northsports.ca",
    capacity: 600,
  },
]}
      columnDefs={locationFields}
      api={locationApi}
      idField="location_id"
      getRowId={(row) => String(row.location_id)}
      createEmptyRow={() => ({
        location_id: -Date.now(),
        location_type: "Branch",
        name: "",
        address: "",
        city: "",
        province: "QC",
        postal_code: "",
        web_address: null,
        capacity: 1,
        location_phone: [],
      })}
      validateRow={validateLocation}
      toCreateInput={toLocationInput}
      toUpdateInput={toLocationInput}
    />
  );
}
