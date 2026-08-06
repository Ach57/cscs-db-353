const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1").replace(/\/+$/, "");

export interface ApiEnvelope<T> { success: boolean; data: T; }
type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

function errorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === "object") {
    const body = payload as Record<string, unknown>;
    if (typeof body.message === "string") return body.message;
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.errors)) {
      return body.errors.map((e) => typeof e === "string" ? e : JSON.stringify(e)).join("; ");
    }
  }
  return `API request failed (${status})`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  let response: Response;
  try {
    response = await fetch(`${API_URL}${normalized}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new Error(`Cannot reach the backend at ${API_URL}. Start the API and verify VITE_API_URL.`);
  }

  if (response.status === 204) return undefined as T;
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(errorMessage(payload, response.status));

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) => request<T>(path, { method: "POST", body: data }),
  put: <T>(path: string, data: unknown) => request<T>(path, { method: "PUT", body: data }),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
};
