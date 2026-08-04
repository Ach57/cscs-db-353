import type { CrudApi } from "./crudApi";
import { api } from "./api";
import type { Location, LocationInput, LocationPhone } from "../types/location";

function normalizePhones(value: unknown): LocationPhone[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (typeof entry === "string") return entry.trim();
      if (entry && typeof entry === "object" && "phone_number" in entry) {
        return String(entry.phone_number).trim();
      }
      return "";
    })
    .filter(Boolean)
    .map((phone_number) => ({ phone_number }));
}

function normalizeLocation(location: Location): Location {
  const rawLocation = location as Location & {
    phone_numbers?: string[];
    phones?: LocationPhone[];
  };

  return {
    ...location,
    web_address: location.web_address || null,
    capacity: Number(location.capacity),
    location_phone: normalizePhones(
      rawLocation.location_phone ?? rawLocation.phone_numbers ?? rawLocation.phones,
    ),
  };
}

export const locationApi: CrudApi<Location, LocationInput, LocationInput> = {
  async getAll() {
    const locations = await api.get<Location[]>("/api/locations");
    return locations.map(normalizeLocation);
  },

  async create(data) {
    const location = await api.post<Location>("/api/locations", data);
    return normalizeLocation(location);
  },

  async update(id, data) {
    const location = await api.put<Location>(`/api/locations/${id}`, data);
    return normalizeLocation(location);
  },

  remove(id) {
    return api.delete(`/api/locations/${id}`);
  },
};
