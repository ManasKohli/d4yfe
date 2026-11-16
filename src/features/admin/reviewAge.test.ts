import { reviewAge } from '@/features/admin/reviewAge';

const today = '2026-11-13';
const submittedDaysAgo = (days: number) => {
  const date = new Date(2026, 10, 13 - days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

describe('reviewAge', () => {
  it.each([
    [0, null],
    [4, null],
    [5, 'Mentor reminder'],
    [6, 'Mentor reminder'],
    [7, 'Coordinator alert'],
    [9, 'Reassigned'],
    [30, 'Reassigned'],
  ])('a review open %i days is at step %s', (days, action) => {
    const age = reviewAge({ submitted: submittedDaysAgo(days) }, today);
    expect(age.days).toBe(days);
    expect(age.step?.action ?? null).toBe(action);
  });

  it('counts calendar days across a month boundary', () => {
    expect(reviewAge({ submitted: '2026-10-30' }, '2026-11-04').days).toBe(5);
  });
});
