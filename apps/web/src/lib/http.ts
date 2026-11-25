const BASE = '/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers },
    ...init,
  });

  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: { error?: { code?: string; message?: string; details?: unknown } } = {} as any;
    try {
      body = await res.json();
    } catch {
      /* ignore */
    }
    throw new ApiError(
      res.status,
      body.error?.code ?? 'UNKNOWN',
      body.error?.message ?? `HTTP ${res.status}`,
      body.error?.details,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const http = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { method: 'GET', ...init }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), ...init }),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...init }),
  delete: <T>(path: string, init?: RequestInit) => request<T>(path, { method: 'DELETE', ...init }),
};

/** Upload multipart/form-data (sem Content-Type, o browser define o boundary) */
export async function uploadForm<T>(
  path: string,
  formData: FormData,
  method: 'POST' | 'PATCH' = 'POST',
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: { error?: { code?: string; message?: string } } = {} as any;
    try {
      body = await res.json();
    } catch {
      /* ignore */
    }
    throw new ApiError(
      res.status,
      body.error?.code ?? 'UNKNOWN',
      body.error?.message ?? `HTTP ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}
