import { api } from "./api";

export interface CrudApi<T, CreateInput = Partial<T>, UpdateInput = Partial<T>> {
  getAll(): Promise<T[]>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  remove(id: string): Promise<void>;
}

export function createCrudApi<T, CreateInput = Partial<T>, UpdateInput = Partial<T>>(
  endpoint: string,
): CrudApi<T, CreateInput, UpdateInput> {
  return {
    getAll: () => api.get<T[]>(endpoint),
    create: (data) => api.post<T>(endpoint, data),
    update: (id, data) => api.put<T>(`${endpoint}/${encodeURIComponent(id)}`, data),
    remove: (id) => api.delete(`${endpoint}/${encodeURIComponent(id)}`),
  };
}
