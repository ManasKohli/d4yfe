import { escalationRule } from '@/data/portal.js';
import { daysBetween } from '@/shared/lib/format.js';

/** Days a review has been open and the escalation step it has reached, if any. */
export function reviewAge(review, today) {
  const days = daysBetween(review.submitted, today);
  const step = [...escalationRule].reverse().find(rule => days >= rule.day) ?? null;
  return { days, step };
}
