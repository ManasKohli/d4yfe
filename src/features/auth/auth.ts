import { roleHome } from '@/app/paths';
import type { Role } from '@/types';

/** The three signed-in roles. In preview mode (no backend) the sign-in page links straight to each area. */
export const roles: { id: Role; label: string; home: string; description: string }[] = [
  { id: 'student', label: 'Student', home: roleHome.student, description: 'Modules, assignments, feedback, sessions' },
  { id: 'mentor', label: 'Mentor', home: roleHome.mentor, description: 'Review queue, availability, volunteer record' },
  { id: 'admin', label: 'D4Y admin', home: roleHome.admin, description: 'Students, mentors, reviews, hardship seats' },
];

/** Supabase's password rule for this project (Authentication → Policies): 10+ characters, letters and digits. */
export function passwordProblem(password: string, confirm: string): string | null {
  if (password.length < 10) return 'Use at least 10 characters.';
  if (!/[a-z]/i.test(password) || !/\d/.test(password)) return 'Use both letters and numbers.';
  if (password !== confirm) return 'The two passwords don’t match.';
  return null;
}

/**
 * The page to return to after signing in: a `next` path from our own site only, inside the area the
 * person's role can open. Anything else (another site, `//host`, another role's area) goes home.
 */
export function afterSignIn(role: Role, next: string | null): string {
  const home = roleHome[role];
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return home;
  return next === home || next.startsWith(`${home}/`) ? next : home;
}
