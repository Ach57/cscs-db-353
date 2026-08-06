const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1").replace(/\/+$/, "");

export interface ApiEnvelope<T> { success: boolean; data: T; }
type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export interface ApiErrorDetail {
  message: string;
  type?: string;
  code?: string;
  errno?: number;
  sqlState?: string;
  constraint?: string;
  field?: string;
  value?: string;
  databaseMessage?: string;
  detail?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly details: ApiErrorDetail;

  constructor(status: number, details: ApiErrorDetail) {
    super(details.message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function extractError(payload: unknown, status: number): ApiErrorDetail {
  if (payload && typeof payload === "object") {
    const body = payload as Record<string, unknown>;
    const nested = body.error && typeof body.error === "object"
      ? body.error as Record<string, unknown>
      : body;

    const message = typeof nested.message === "string"
      ? nested.message
      : typeof body.message === "string"
        ? body.message
        : `API request failed (${status})`;

    return {
      message,
      ...(typeof nested.type === "string" ? { type: nested.type } : {}),
      ...(typeof nested.code === "string" ? { code: nested.code } : {}),
      ...(typeof nested.errno === "number" ? { errno: nested.errno } : {}),
      ...(typeof nested.sqlState === "string" ? { sqlState: nested.sqlState } : {}),
      ...(typeof nested.constraint === "string" ? { constraint: nested.constraint } : {}),
      ...(typeof nested.field === "string" ? { field: nested.field } : {}),
      ...(typeof nested.value === "string" ? { value: nested.value } : {}),
      ...(typeof nested.databaseMessage === "string" ? { databaseMessage: nested.databaseMessage } : {}),
      ...(typeof nested.detail === "string" ? { detail: nested.detail } : {}),
    };
  }
  return { message: `API request failed (${status})` };
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
  if (!response.ok) throw new ApiError(response.status, extractError(payload, response.status));

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
