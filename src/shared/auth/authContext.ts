import { createContext, useContext } from 'react';
import type { Me } from '@/types';

/** Where the signed-in state stands. `disabled` is preview mode: no backend configured. */
export type AuthState =
  | { status: 'disabled' }
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'signed-in'; me: Me }
  | { status: 'error'; message: string };

export interface AuthContextValue {
  state: AuthState;
  /** Signs in with email and password, then loads the profile. Resolves with it so the caller can route by role. */
  signIn: (email: string, password: string) => Promise<Me>;
  signOut: () => Promise<void>;
  /** Emails a reset link. Resolves the same way whether or not the account exists. */
  sendPasswordReset: (email: string) => Promise<void>;
  /** Sets a new password for the signed-in user (after an invite or reset link). */
  updatePassword: (password: string) => Promise<void>;
  /** The current access token, refreshed if needed, for API calls. */
  getAccessToken: () => Promise<string | null>;
  /** Tries loading the profile again after an error. */
  retry: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
