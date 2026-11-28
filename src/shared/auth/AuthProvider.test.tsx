import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ApiRequestError } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/authContext';
import AuthProvider from '@/shared/auth/AuthProvider';
import type { Me } from '@/types';

const getMe = vi.hoisted(() => vi.fn());
vi.mock('@/shared/api/client', async importOriginal => ({ ...(await importOriginal<object>()), getMe }));

const admin: Me = { id: 'u1', email: 'a@example.com', fullName: 'Avery', role: 'admin', student: null, mentor: null };
const session = { access_token: 'tok', user: { id: 'u1' } };

function fakeClient(initial: typeof session | null) {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: initial } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  };
}

function Status() {
  const { state } = useAuth();
  return <p>{state.status === 'signed-in' ? `in:${state.me.role}` : state.status}</p>;
}

const mount = (client: ReturnType<typeof fakeClient> | null) =>
  render(<AuthProvider client={client as unknown as SupabaseClient}><Status/></AuthProvider>);

describe('AuthProvider', () => {
  it('is disabled without a backend (preview mode)', () => {
    mount(null);
    expect(screen.getByText('disabled')).toBeTruthy();
  });

  it('loads the profile for an existing session and takes the role from /me', async () => {
    getMe.mockResolvedValueOnce(admin);
    mount(fakeClient(session));
    expect(await screen.findByText('in:admin')).toBeTruthy();
    expect(getMe).toHaveBeenCalledWith('tok');
  });

  it('is signed out without a session', async () => {
    mount(fakeClient(null));
    expect(await screen.findByText('signed-out')).toBeTruthy();
  });

  it('signs out locally when the API refuses the account (deleted or banned)', async () => {
    getMe.mockRejectedValueOnce(new ApiRequestError(401, 'unauthorized', 'Invalid or expired token'));
    const client = fakeClient(session);
    mount(client);
    expect(await screen.findByText('signed-out')).toBeTruthy();
    expect(client.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });

  it('shows an error, not a sign-out, when the API is unreachable', async () => {
    getMe.mockRejectedValueOnce(new ApiRequestError(0, 'network_error', 'offline'));
    const client = fakeClient(session);
    mount(client);
    expect(await screen.findByText('error')).toBeTruthy();
    expect(client.auth.signOut).not.toHaveBeenCalled();
  });

  it('maps a wrong password to a plain message', async () => {
    const client = fakeClient(null);
    client.auth.signInWithPassword.mockResolvedValue({ data: { session: null }, error: { code: 'invalid_credentials', message: 'Invalid login credentials' } });
    function TrySignIn() {
      const { signIn } = useAuth();
      const [message, setMessage] = useState('');
      return <button type="button" onClick={() => { signIn('a@example.com', 'nope').catch((error: Error) => setMessage(error.message)); }}>{message || 'go'}</button>;
    }
    render(<AuthProvider client={client as unknown as SupabaseClient}><TrySignIn/></AuthProvider>);
    await waitFor(() => expect(client.auth.getSession).toHaveBeenCalled());
    fireEvent.click(screen.getByText('go'));
    expect(await screen.findByText('That email and password don’t match an account.')).toBeTruthy();
  });
});
