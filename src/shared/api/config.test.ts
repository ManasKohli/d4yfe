import { readBackendConfig } from '@/shared/api/config';

const full = {
  VITE_SUPABASE_URL: 'https://ref.supabase.co/',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_abc',
  VITE_API_URL: 'http://localhost:8080',
};

describe('readBackendConfig', () => {
  it('reads all three, keeping only the origins', () => {
    expect(readBackendConfig(full)).toEqual({ supabaseUrl: 'https://ref.supabase.co', publishableKey: 'sb_publishable_abc', apiUrl: 'http://localhost:8080' });
  });

  it.each([
    ['nothing', {}],
    ['no API URL', { ...full, VITE_API_URL: '' }],
    ['no key', { ...full, VITE_SUPABASE_PUBLISHABLE_KEY: ' ' }],
    ['a non-http URL', { ...full, VITE_SUPABASE_URL: 'javascript:alert(1)' }],
  ])('falls back to preview mode with %s', (_name, env) => {
    expect(readBackendConfig(env)).toBeNull();
  });

  it('refuses a secret key in the browser bundle', () => {
    expect(() => readBackendConfig({ ...full, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_xyz' })).toThrow('secret key');
  });
});
