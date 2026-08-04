import { api } from "./api";
import type { Location, LocationInput } from "../types/location";

export const listLocations = () => api.get<Location[]>("/api/locations");

export const getLocation = (id:number) => api.get<Location>(`/api/locations/${id}`);

export const createLocation = (input:LocationInput) => api.post<Location>("/api/locations", input);

export const updateLocation = (id:number,input:Partial<LocationInput>) => api.put<Location>(`/api/locations/${id}`, input);

export const deleteLocation = (id:number) => api.delete(`/api/locations/${id}`);
