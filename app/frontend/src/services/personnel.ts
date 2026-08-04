import { createCrudApi } from "./crudApi";
import { createLocalStorageCrudApi } from "./localStorageCrudApi";
import type { Personnel, PersonnelInput } from "../types/personnel";

const seed: Personnel[] = [
  {
    personnel_id: 1,
    first_name: "Nadia",
    last_name: "Martin",
    date_of_birth: "1984-04-15",
    ssn: "111-222-333",
    medicare_number: "MART84041501",
    phone_number: "514-555-3100",
    address: "10 Club Avenue",
    city: "Montreal",
    province: "QC",
    postal_code: "H2X 2B2",
    email: "nadia.martin@example.ca",
    role: "General Manager",
    mandate: "Salaried",
  },
];

const mockApi = createLocalStorageCrudApi<Personnel, PersonnelInput, PersonnelInput>({
  storageKey: "cscs.personnel",
  idField: "personnel_id",
  seed,
  fromCreate: (input, id) => ({ personnel_id: id, ...input }),
});

const realApi = createCrudApi<Personnel, PersonnelInput, PersonnelInput>("/api/personnel");

export const personnelApi = import.meta.env.VITE_USE_MOCK_API === "false"
  ? realApi
  : mockApi;
