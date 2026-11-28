import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { backendConfig } from '@/shared/api/config';

let client: SupabaseClient | null | undefined;

/**
 * The Supabase client, used for sign-in and the session only: app data always goes through the
 * Express API (backend plan section 1). Null in preview mode. Created on first use, so an invite or
 * reset link's `#access_token=…` is read (and cleared) by the page that handles it.
 */
export function getSupabase(): SupabaseClient | null {
  if (client === undefined) {
    client = backendConfig
      ? createClient(backendConfig.supabaseUrl, backendConfig.publishableKey, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
        })
      : null;
  }
  return client;
}
