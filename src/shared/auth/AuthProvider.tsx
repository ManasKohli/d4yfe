import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ApiRequestError, getMe } from '@/shared/api/client';
import { getSupabase } from '@/shared/api/supabase';
import { AuthContext, type AuthContextValue, type AuthState } from '@/shared/auth/authContext';
import type { Me } from '@/types';

const notConnected = () => new Error('Sign-in is not connected yet. Use the preview links below.');

/** Plain-language messages for Supabase Auth errors people can fix themselves. */
function authMessage(error: { code?: string; message: string }): string {
  switch (error.code) {
    case 'invalid_credentials': return 'That email and password don’t match an account.';
    case 'email_not_confirmed': return 'Confirm your email first: open the link we sent you.';
    case 'weak_password': return 'Choose a longer password: at least 10 characters, with letters and numbers.';
    case 'same_password': return 'Choose a password you haven’t used before.';
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit': return 'Too many attempts. Wait a minute and try again.';
    default: return 'Something went wrong. Try again in a moment.';
  }
}

/**
 * Holds the Supabase session and the caller's profile from GET /me. The role always comes from
 * /me (the API reads it from the database), never from the token (backend plan section 8).
 */
export default function AuthProvider({ children, client = getSupabase() }: { children: ReactNode; client?: SupabaseClient | null }) {
  const [state, setState] = useState<AuthState>(client ? { status: 'loading' } : { status: 'disabled' });
  const [attempt, setAttempt] = useState(0);
  // The user id whose profile is loaded or loading, so token refreshes don't refetch /me.
  const loadedFor = useRef<string | null>(null);

  const loadMe = useCallback(async (token: string, userId: string): Promise<Me> => {
    loadedFor.current = userId;
    try {
      const me = await getMe(token);
      setState({ status: 'signed-in', me });
      return me;
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        // A valid Supabase session the API refuses: deleted or banned account. Sign it out locally.
        loadedFor.current = null;
        await client?.auth.signOut({ scope: 'local' });
        setState({ status: 'signed-out' });
        throw new Error('This account can’t sign in. Contact D4Y if you think that’s a mistake.');
      }
      loadedFor.current = null;
      const message = error instanceof ApiRequestError && error.status !== 0 && error.status < 500
        ? error.message
        : 'We couldn’t load your account. Check your connection and try again.';
      setState({ status: 'error', message });
      throw new Error(message);
    }
  }, [client]);

  useEffect(() => {
    if (!client) return;
    let live = true;

    client.auth.getSession().then(({ data }) => {
      if (!live) return;
      const session = data.session;
      if (session) loadMe(session.access_token, session.user.id).catch(() => {});
      else setState({ status: 'signed-out' });
    });

    const { data } = client.auth.onAuthStateChange((event, session) => {
      if (!live) return;
      if (event === 'SIGNED_OUT' || !session) {
        loadedFor.current = null;
        setState({ status: 'signed-out' });
        return;
      }
      // Supabase warns against awaiting its own calls inside this callback; defer the load.
      if (loadedFor.current !== session.user.id) {
        setTimeout(() => { if (live) loadMe(session.access_token, session.user.id).catch(() => {}); }, 0);
      }
    });

    return () => { live = false; data.subscription.unsubscribe(); };
  }, [client, loadMe, attempt]);

  const value = useMemo<AuthContextValue>(() => ({
    state,
    async signIn(email, password) {
      if (!client) throw notConnected();
      const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data.session) throw new Error(authMessage(error ?? { message: 'no session' }));
      setState({ status: 'loading' });
      return loadMe(data.session.access_token, data.session.user.id);
    },
    async signOut() {
      loadedFor.current = null;
      if (client) await client.auth.signOut();
      setState(client ? { status: 'signed-out' } : { status: 'disabled' });
    },
    async sendPasswordReset(email) {
      if (!client) throw notConnected();
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: new URL('/account/password', window.location.origin).href,
      });
      // Only rate limits are worth reporting; anything else must not reveal whether the account exists.
      if (error && error.code?.startsWith('over_')) throw new Error(authMessage(error));
    },
    async updatePassword(password) {
      if (!client) throw notConnected();
      const { error } = await client.auth.updateUser({ password });
      if (error) throw new Error(authMessage(error));
    },
    async getAccessToken() {
      if (!client) return null;
      const { data } = await client.auth.getSession();
      return data.session?.access_token ?? null;
    },
    retry() {
      loadedFor.current = null;
      setState({ status: 'loading' });
      setAttempt(current => current + 1);
    },
  }), [client, loadMe, state]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
