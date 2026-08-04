export interface CrudApi<T, CreateInput = Partial<T>, UpdateInput = Partial<T>> {
  getAll(): Promise<T[]>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  remove(id: string): Promise<void>;
}

const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const url = `${API_URL}${normalizedEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      message = errorBody?.message ?? errorBody?.detail ?? message;
    } catch {
      // Response was not JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function createCrudApi<
  T,
  CreateInput = Partial<T>,
  UpdateInput = Partial<T>,
>(endpoint: string): CrudApi<T, CreateInput, UpdateInput> {
  return {
    getAll: () => request<T[]>(endpoint),
    create: (data) => request<T>(endpoint, { method: "POST", body: data }),
    update: (id, data) => request<T>(`${endpoint}/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data,
    }),
    remove: (id) => request<void>(`${endpoint}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  };
}