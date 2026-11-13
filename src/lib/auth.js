import { paths } from '../routes.js';

/** The three signed-in roles and where each one lands after signing in. */
export const roles = [
  { id: 'student', label: 'Student', home: paths.student, description: 'Modules, assignments, feedback, sessions' },
  { id: 'mentor', label: 'Mentor', home: paths.mentor, description: 'Review queue, availability, volunteer record' },
  { id: 'admin', label: 'D4Y admin', home: paths.admin, description: 'Students, mentors, reviews, hardship seats' },
];

/**
 * Sign-in placeholder. Replace with Supabase auth (supabase.auth.signInWithPassword),
 * then read the user's role from their profile and send them to that role's `home`.
 */
export async function signIn() {
  throw new Error('Sign-in is not connected yet. Use the preview links below.');
}
