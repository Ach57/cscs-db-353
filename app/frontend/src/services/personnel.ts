import { createCrudApi } from "./crudApi";
import type { Personnel, PersonnelInput } from "../types/personnel";
export const personnelApi = createCrudApi<Personnel, PersonnelInput, Partial<PersonnelInput>>("/personnel");
