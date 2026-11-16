import type { Assignment, StatusKey } from '@/types';

/** Statuses that ask the student to do something. */
const actionable: StatusKey[] = ['feedback-ready', 'revise', 'not-started'];

/**
 * The student's "Up next" list (design review D2): feedback ready to read comes first,
 * then everything else by date, soonest first. Ties keep their original order.
 */
export function upNext(assignments: Assignment[]): Assignment[] {
  return assignments
    .filter(item => actionable.includes(item.status))
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const readyA = a.item.status === 'feedback-ready' ? 0 : 1;
      const readyB = b.item.status === 'feedback-ready' ? 0 : 1;
      return readyA - readyB || a.item.date.localeCompare(b.item.date) || a.index - b.index;
    })
    .map(({ item }) => item);
}
