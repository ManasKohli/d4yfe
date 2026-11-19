import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import MentorReview from '@/features/mentor/pages/MentorReview';
import { resetMockApi } from '@/shared/api/mockApi';

function renderReview(id = 'q1') {
  render(
    <MemoryRouter initialEntries={[`/mentor/reviews/${id}`]}>
      <Routes><Route path="/mentor/reviews/:id" element={<MentorReview/>}/></Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => resetMockApi());

describe('MentorReview actions', () => {
  it('flags to the coordinator without requiring the rubric', () => {
    renderReview();
    // jsdom ignores formNoValidate on click, so submit explicitly after the click records the action.
    const flag = screen.getByRole('button', { name: 'Flag to coordinator' });
    fireEvent.click(flag);
    fireEvent.submit(flag.closest('form')!);
    expect(screen.getByRole('status').textContent).toBe('Flagged to the program coordinator.');
  });

  it('sends feedback when the form is submitted normally', async () => {
    renderReview();
    const submit = screen.getByRole('button', { name: 'Submit feedback' });
    fireEvent.click(submit);
    fireEvent.submit(submit.closest('form')!);
    expect((await screen.findByRole('status')).textContent).toBe('Feedback sent to the student. Your volunteer hours are logged.');
  });

  it('uploads a commented document and sends it with the feedback', async () => {
    renderReview();
    const file = new File(['notes'], 'comments.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    fireEvent.change(screen.getByLabelText('Commented document (optional)'), { target: { files: [file] } });
    expect(await screen.findByText('comments.docx')).toBeTruthy();
    const submit = screen.getByRole('button', { name: 'Submit feedback' });
    fireEvent.click(submit);
    fireEvent.submit(submit.closest('form')!);
    expect((await screen.findByText(/with your commented document/)).textContent).toContain('Feedback sent to the student');
  });

  it('rejects a commented document of the wrong type', async () => {
    renderReview();
    const file = new File(['x'], 'scan.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Commented document (optional)'), { target: { files: [file] } });
    expect((await screen.findByRole('alert')).textContent).toContain('This file type isn’t accepted');
  });

  it('shows video links and typed answers for a practice set', () => {
    renderReview('q5');
    expect(screen.getAllByRole('link', { name: /Open video/ })).toHaveLength(2);
    expect(screen.getByText('Typed 1')).toBeTruthy();
  });
});
