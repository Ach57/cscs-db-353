export interface CrudApi<T, CreateInput = Omit<T, never>> {
  getAll(): Promise<T>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}

interface RequestOptions extends RequestInit {
  body?: string;
}

async function request<T>(
  url: string,
  options?: RequestOptions,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();

      if (typeof errorBody.message === "string") {
        message = errorBody.message;
      }
    } catch {
      // The server did not return JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function createCrudApi<T, CreateInput = Partial<T>>(
  endpoint: string,
) {
  return {
    getAll(): Promise<T[]> {
      return request<T[]>(endpoint);
    },

    create(data: CreateInput): Promise<T> {
      return request<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update(id: string, data: Partial<T>): Promise<T> {
      return request<T>(
        `${endpoint}/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
      );
    },

    remove(id: string): Promise<void> {
      return request<void>(
        `${endpoint}/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
    },
  };
}