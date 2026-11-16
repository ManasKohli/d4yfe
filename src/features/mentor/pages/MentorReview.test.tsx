import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import MentorReview from '@/features/mentor/pages/MentorReview';

function renderReview() {
  render(
    <MemoryRouter initialEntries={['/mentor/reviews/q1']}>
      <Routes><Route path="/mentor/reviews/:id" element={<MentorReview/>}/></Routes>
    </MemoryRouter>,
  );
}

describe('MentorReview actions', () => {
  it('flags to the coordinator without requiring the rubric', () => {
    renderReview();
    // jsdom ignores formNoValidate on click, so submit explicitly after the click records the action.
    const flag = screen.getByRole('button', { name: 'Flag to coordinator' });
    fireEvent.click(flag);
    fireEvent.submit(flag.closest('form')!);
    expect(screen.getByRole('status').textContent).toBe('Flagged to the program coordinator.');
  });

  it('sends feedback when the form is submitted normally', () => {
    renderReview();
    const submit = screen.getByRole('button', { name: 'Submit feedback' });
    fireEvent.click(submit);
    fireEvent.submit(submit.closest('form')!);
    expect(screen.getByRole('status').textContent).toContain('Feedback sent to the student.');
  });
});
