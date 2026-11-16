import type { EscalationStep } from '@/types';
import { escalationRule } from '@/data/portal';
import { daysBetween } from '@/shared/lib/format';

/** Days a review has been open and the escalation step it has reached, if any. */
export function reviewAge(review: { submitted: string }, today: string): { days: number; step: EscalationStep | null } {
  const days = daysBetween(review.submitted, today);
  // An unreadable date is treated as fully escalated so it is never hidden as "on time".
  const steps = [...escalationRule].sort((a, b) => b.day - a.day);
  if (Number.isNaN(days)) return { days, step: steps[0] ?? null };
  const step = steps.find(rule => days >= rule.day) ?? null;
  return { days, step };
}
