import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Assignments from '@/features/student/pages/Assignments';
import { resetMockApi } from '@/shared/api/mockApi';

beforeEach(() => resetMockApi());

const renderPage = () => render(<MemoryRouter><Assignments/></MemoryRouter>);
const openPracticeSet = () => fireEvent.click(screen.getByRole('button', { name: /CASPer practice set/ }));

describe('Assignments submission', () => {
  it('requires a file before submitting', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Submit for review' }));
    expect(screen.getByRole('alert').textContent).toBe('Choose a file to upload.');
  });

  it('uploads the file, then submits for review', async () => {
    renderPage();
    const file = new File(['plan'], 'study-plan.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('Your file'), { target: { files: [file] } });
    expect(await screen.findByText('study-plan.pdf')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Submit for review' }));
    expect((await screen.findByRole('status')).textContent).toContain('Submitted. In review.');
  });

  it('asks for video links and typed answers on a practice set, and rejects a link from another host', () => {
    renderPage();
    openPracticeSet();
    expect(screen.getByLabelText('Video 1 link')).toBeTruthy();
    expect(screen.getByLabelText('Typed answer 3')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Video 1 link'), { target: { value: 'https://dropbox.com/s/answer' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit for review' }));
    expect(screen.getByRole('alert').textContent).toContain('Video 1: paste a link from');
  });

  it('submits a practice set with links and typed answers', async () => {
    renderPage();
    openPracticeSet();
    fireEvent.change(screen.getByLabelText('Video 1 link'), { target: { value: 'https://youtu.be/answer1' } });
    fireEvent.change(screen.getByLabelText('Video 2 link'), { target: { value: 'https://www.loom.com/share/answer2' } });
    for (const number of [1, 2, 3]) fireEvent.change(screen.getByLabelText(`Typed answer ${number}`), { target: { value: `Answer ${number}` } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit for review' }));
    expect((await screen.findByRole('status')).textContent).toContain('Submitted. In review.');
  });
});
