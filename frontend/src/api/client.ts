import type { ApiError, AuthResponse } from '../types';

const API_BASE = '/api/v1';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err: ApiError = {
      message: data?.message ?? res.statusText ?? 'Request failed',
      status: res.status,
    };
    throw err;
  }
  return data as T;
}

export const authApi = {
  login: (username: string, password: string) =>
    api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  register: (body: Record<string, unknown>) =>
    api<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export const crudApi = {
  list: <T>(resource: string) => api<T[]>(`/${resource}`),
  get: <T>(resource: string, id: number) => api<T>(`/${resource}/${id}`),
  create: <T>(resource: string, body: unknown) =>
    api<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(body) }),
  update: <T>(resource: string, id: number, body: unknown) =>
    api<T>(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (resource: string, id: number) =>
    api<void>(`/${resource}/${id}`, { method: 'DELETE' }),
};
