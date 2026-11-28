import { paths } from '@/app/paths';

/**
 * Supabase invite and password-reset links land on the site URL with the session in the hash
 * (`#access_token=…&type=invite`) or an error (`#error=access_denied&error_code=otp_expired`).
 * Both belong on the set-password page, which reads the hash and asks for a new password.
 */
export function getAuthLinkRedirect(pathname: string, hash: string): string | null {
  if (pathname === paths.setPassword || !hash) return null;
  const params = new URLSearchParams(hash.slice(1));
  const type = params.get('type');
  const isAuthLink = (params.has('access_token') && (type === 'invite' || type === 'recovery')) || params.has('error_code');
  return isAuthLink ? `${paths.setPassword}${hash}` : null;
}

export function redirectAuthLink() {
  const target = getAuthLinkRedirect(window.location.pathname, window.location.hash);
  if (target) window.history.replaceState(null, '', target);
}
