export type LocationType = "Head" | "Branch";

export interface LocationPhone {
  phone_number: string;
}

export interface Location {
  location_id: number;
  location_type: LocationType;
  name: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  web_address: string | null;
  capacity: number;
  location_phone: LocationPhone[];
}

/** Payload accepted by the location create/update endpoints. */
export type LocationInput = Omit<Location, "location_id" | "location_phone"> & {
  phone_numbers: string[];
};
