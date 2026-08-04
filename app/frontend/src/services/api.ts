const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 204) return undefined as T;
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof payload?.detail === "string" ? payload.detail : JSON.stringify(payload?.detail ?? payload);
    throw new Error(message || `API request failed (${response.status})`);
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) => request<T>(path, { method: "POST", body: { data } }),
  put: <T>(path: string, data: unknown) => request<T>(path, { method: "PUT", body: { data } }),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
};
