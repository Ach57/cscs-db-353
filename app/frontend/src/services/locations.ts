import type { CrudApi } from "./crudApi";
import { createCrudApi } from "./crudApi";
import { createLocalStorageCrudApi } from "./localStorageCrudApi";
import type { Location, LocationInput, LocationPhone } from "../types/location";

function normalizePhones(value: unknown): LocationPhone[] {
  if (!Array.isArray(value)) return [];
  const unique = new Set(
    value.map((entry) => {
      if (typeof entry === "string") return entry.trim();
      if (entry && typeof entry === "object" && "phone_number" in entry) {
        return String(entry.phone_number).trim();
      }
      return "";
    }).filter(Boolean),
  );
  return [...unique].map((phone_number) => ({ phone_number }));
}

function fromInput(input: LocationInput, id: number): Location {
  return {
    location_id: id,
    location_type: input.location_type,
    name: input.name,
    address: input.address,
    city: input.city,
    province: input.province,
    postal_code: input.postal_code,
    web_address: input.web_address,
    capacity: Number(input.capacity),
    location_phone: normalizePhones(input.phone_numbers),
  };
}

const seed: Location[] = [
  {
    location_id: 1,
    location_type: "Head",
    name: "Downtown Soccer Centre",
    address: "123 Main St",
    city: "Montreal",
    province: "QC",
    postal_code: "H2X 1A1",
    web_address: "https://downtownsoccer.ca",
    capacity: 450,
    location_phone: [{ phone_number: "514-555-1000" }],
  },
  {
    location_id: 2,
    location_type: "Branch",
    name: "West Island Complex",
    address: "88 Lakeshore Blvd",
    city: "Dorval",
    province: "QC",
    postal_code: "H9S 4B5",
    web_address: "https://westislandsoccer.ca",
    capacity: 300,
    location_phone: [{ phone_number: "514-555-2000" }],
  },
];

const mockApi = createLocalStorageCrudApi<Location, LocationInput, LocationInput>({
  storageKey: "cscs.locations",
  idField: "location_id",
  seed,
  fromCreate: fromInput,
  applyUpdate: (current, input) => ({ ...fromInput(input, current.location_id) }),
});

const realApi = createCrudApi<Location, LocationInput, LocationInput>("/api/locations");

export const locationApi: CrudApi<Location, LocationInput, LocationInput> =
  import.meta.env.VITE_USE_MOCK_API === "false" ? realApi : mockApi;
