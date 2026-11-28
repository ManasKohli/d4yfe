/**
 * Where the backend lives, from the build-time env (`.env.local` locally; Vercel and the Firebase
 * deploy set them per environment). All three or none: with none, the site runs in preview mode
 * (sample data, open preview links), which is what Vercel previews without a backend still use.
 */
export interface BackendConfig {
  supabaseUrl: string;
  publishableKey: string;
  apiUrl: string;
}

type Env = Partial<Record<'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY' | 'VITE_API_URL', string>>;

const origin = (value: string | undefined) => {
  if (!value || !URL.canParse(value)) return null;
  const url = new URL(value);
  return /^https?:$/.test(url.protocol) ? url.origin : null;
};

export function readBackendConfig(env: Env): BackendConfig | null {
  const supabaseUrl = origin(env.VITE_SUPABASE_URL);
  const apiUrl = origin(env.VITE_API_URL);
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';
  // Only the publishable key belongs in a browser bundle; refuse a secret key outright.
  if (publishableKey.startsWith('sb_secret_')) throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY holds a secret key. Use the publishable key.');
  if (!supabaseUrl || !apiUrl || !publishableKey) return null;
  return { supabaseUrl, publishableKey, apiUrl };
}

export const backendConfig = readBackendConfig(import.meta.env as Env);
