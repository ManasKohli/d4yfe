import { paths, roleHome } from '@/app/paths';
import type { AuthState } from '@/shared/auth/authContext';
import type { Role } from '@/types';

export type Access =
  | { kind: 'allow' }
  | { kind: 'wait' }
  | { kind: 'login'; to: string }
  | { kind: 'redirect'; to: string }
  | { kind: 'error'; message: string };

/**
 * Who may open a signed-in area. Preview mode (no backend) keeps every area open with sample data.
 * The API enforces roles on every request; this only decides what to show.
 */
export function decideAccess(state: AuthState, area: Role, here: string): Access {
  switch (state.status) {
    case 'disabled': return { kind: 'allow' };
    case 'loading': return { kind: 'wait' };
    case 'error': return { kind: 'error', message: state.message };
    case 'signed-out': return { kind: 'login', to: `${paths.login}?next=${encodeURIComponent(here)}` };
    case 'signed-in':
      return state.me.role === area ? { kind: 'allow' } : { kind: 'redirect', to: roleHome[state.me.role] };
  }
}

