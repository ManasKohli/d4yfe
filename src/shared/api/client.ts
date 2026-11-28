import { backendConfig } from '@/shared/api/config';
import type { Me } from '@/types';

/** An error answer from the API (`{ error: { code, message } }`), or a network failure (status 0). */
export class ApiRequestError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

function errorBody(body: unknown): { code: string; message: string } | null {
  if (typeof body !== 'object' || body === null || !('error' in body)) return null;
  const { error } = body as { error: unknown };
  if (typeof error !== 'object' || error === null) return null;
  const { code, message } = error as { code?: unknown; message?: unknown };
  return typeof code === 'string' && typeof message === 'string' ? { code, message } : null;
}

/** GET an API path with the user's access token. Never cached: every response is per user. */
export async function apiGet<T>(path: string, token: string, fetchImpl: typeof fetch = fetch, apiUrl = backendConfig?.apiUrl): Promise<T> {
  if (!apiUrl) throw new ApiRequestError(0, 'not_configured', 'The API is not configured.');
  let res: Response;
  try {
    res = await fetchImpl(new URL(path, apiUrl), {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
    });
  } catch {
    throw new ApiRequestError(0, 'network_error', 'Could not reach the server. Check your connection and try again.');
  }
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const known = errorBody(body);
    throw new ApiRequestError(res.status, known?.code ?? 'http_error', known?.message ?? `Request failed (${res.status}).`);
  }
  return body as T;
}

export const getMe = (token: string, fetchImpl?: typeof fetch) => apiGet<Me>('/me', token, fetchImpl);
