import type { CrudApi } from "./crudApi";
import { api } from "./api";
import type { Location, LocationInput, LocationPhone } from "../types/location";

type LocationRecord = Omit<Location, "location_phone">;
async function enrich(row: LocationRecord): Promise<Location> {
  const phones = await api.get<(LocationPhone & {location_id?:number})[]>(`/locations/${row.location_id}/phones`);
  return { ...row, location_phone: phones.map(({phone_number}) => ({phone_number})) };
}
function base(input: LocationInput) {
  const { phone_numbers: _phones, web_address, ...rest } = input;
  return { ...rest, ...(web_address ? {web_address} : {}) };
}
async function syncPhones(id:number, desired:string[]) {
  const current = await api.get<(LocationPhone & {location_id?:number})[]>(`/locations/${id}/phones`);
  const currentSet = new Set(current.map(p=>p.phone_number));
  const desiredSet = new Set(desired.map(p=>p.trim()).filter(Boolean));
  await Promise.all([...currentSet].filter(p=>!desiredSet.has(p)).map(p=>api.delete(`/locations/${id}/phones/${encodeURIComponent(p)}`)));
  await Promise.all([...desiredSet].filter(p=>!currentSet.has(p)).map(phone_number=>api.post(`/locations/${id}/phones`,{phone_number})));
}
export const locationApi: CrudApi<Location, LocationInput, LocationInput> = {
  async getAll(){ return Promise.all((await api.get<LocationRecord[]>("/locations")).map(enrich)); },
  async create(input){ const row=await api.post<LocationRecord>("/locations",base(input)); await syncPhones(row.location_id,input.phone_numbers); return enrich(row); },
  async update(id,input){ const row=await api.put<LocationRecord>(`/locations/${id}`,base(input)); await syncPhones(Number(id),input.phone_numbers); return enrich(row); },
  remove(id){ return api.delete(`/locations/${id}`); },
};
