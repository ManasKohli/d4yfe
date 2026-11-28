import { ApiRequestError, apiGet } from '@/shared/api/client';

const API = 'http://localhost:8080';
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('apiGet', () => {
  it('sends the access token and returns the body', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(json(200, { role: 'admin' }));
    await expect(apiGet('/me', 'tok', fetchImpl, API)).resolves.toEqual({ role: 'admin' });
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(String(url)).toBe('http://localhost:8080/me');
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer tok');
    expect(init?.cache).toBe('no-store');
  });

  it('turns the API’s error shape into an ApiRequestError', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(json(401, { error: { code: 'unauthorized', message: 'Invalid or expired token' } }));
    await expect(apiGet('/me', 'tok', fetchImpl, API)).rejects.toMatchObject({ status: 401, code: 'unauthorized', message: 'Invalid or expired token' });
  });

  it('copes with a non-JSON error page', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response('<html>bad gateway</html>', { status: 502 }));
    await expect(apiGet('/me', 'tok', fetchImpl, API)).rejects.toMatchObject({ status: 502, code: 'http_error' });
  });

  it('reports a network failure as status 0', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch'));
    const error = await apiGet('/me', 'tok', fetchImpl, API).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error).toMatchObject({ status: 0, code: 'network_error' });
  });

  it('refuses to run without an API URL', async () => {
    await expect(apiGet('/me', 'tok', vi.fn<typeof fetch>(), '')).rejects.toMatchObject({ code: 'not_configured' });
  });
});
