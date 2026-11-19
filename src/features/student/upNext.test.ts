import { upNext } from '@/features/student/upNext';
import type { Assignment } from '@/types';

const item = (id: string, status: Assignment['status'], date: string): Assignment =>
  ({ id, title: id, module: 'dat', status, date, dateLabel: 'Due', answerSpec: ['file'] });

describe('upNext', () => {
  it('puts feedback-ready first, then soonest date first', () => {
    const result = upNext([
      item('later', 'not-started', '2026-11-20'),
      item('sooner', 'revise', '2026-11-10'),
      item('feedback', 'feedback-ready', '2026-12-01'),
    ]);
    expect(result.map(entry => entry.id)).toEqual(['feedback', 'sooner', 'later']);
  });

  it('leaves out work the student is waiting on', () => {
    const result = upNext([
      item('waiting', 'in-review', '2026-11-01'),
      item('sent', 'submitted', '2026-11-01'),
      item('todo', 'not-started', '2026-11-02'),
    ]);
    expect(result.map(entry => entry.id)).toEqual(['todo']);
  });

  it('keeps original order for equal dates', () => {
    const result = upNext([item('a', 'revise', '2026-11-05'), item('b', 'not-started', '2026-11-05')]);
    expect(result.map(entry => entry.id)).toEqual(['a', 'b']);
  });

  it('returns an empty list when nothing is due', () => {
    expect(upNext([])).toEqual([]);
  });
});
