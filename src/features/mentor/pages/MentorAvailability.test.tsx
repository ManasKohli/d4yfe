import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import MentorAvailability from '@/features/mentor/pages/MentorAvailability';

function setup() {
  render(<MemoryRouter><MentorAvailability/></MemoryRouter>);
  const start = screen.getByLabelText('From') as HTMLInputElement;
  const end = screen.getByLabelText('To') as HTMLInputElement;
  return { start, end, form: start.closest('form')! };
}

describe('MentorAvailability', () => {
  it('rejects a window whose end is not after its start', () => {
    const { start, end, form } = setup();
    const before = screen.getAllByRole('button', { name: /^Remove/ }).length;
    fireEvent.change(start, { target: { value: '10:00' } });
    fireEvent.change(end, { target: { value: '09:00' } });
    fireEvent.submit(form);
    expect(screen.getByRole('alert').textContent).toBe('The end time must be after the start time.');
    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(before);
  });

  it('adds a valid window in day order', () => {
    const { start, end, form } = setup();
    fireEvent.change(screen.getByLabelText('Day'), { target: { value: 'Monday' } });
    fireEvent.change(start, { target: { value: '08:00' } });
    fireEvent.change(end, { target: { value: '09:00' } });
    fireEvent.submit(form);
    expect(screen.queryByRole('alert')).toBeNull();
    const first = screen.getAllByRole('button', { name: /^Remove/ })[0];
    expect(first?.textContent).toContain('Monday 08:00');
  });
});
