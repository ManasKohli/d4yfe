import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Assignments from '@/features/student/pages/Assignments';

describe('Assignments submission', () => {
  it('requires a file before submitting', () => {
    render(<MemoryRouter><Assignments/></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Submit for review' }));
    expect(screen.getByRole('alert').textContent).toBe('Choose a file to upload.');
  });
});
