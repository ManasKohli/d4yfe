import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AdminContent from '@/features/admin/pages/AdminContent';
import { getModuleContent, resetMockApi } from '@/shared/api/mockApi';

beforeEach(() => resetMockApi());

const group = (name: RegExp) => screen.getByRole('region', { name });

async function openModule(slug: string, chapterTitle: string) {
  render(<AdminContent/>);
  fireEvent.change(screen.getByLabelText('Module'), { target: { value: slug } });
  await screen.findByRole('region', { name: new RegExp(`${chapterTitle}: lessons`) });
}

describe('AdminContent', () => {
  it('adds a video link to an unrecorded lesson and publishes it', async () => {
    await openModule('dat', 'Full-length practice');
    const lessons = group(/Full-length practice: lessons/);
    expect(within(lessons).getByText('Not recorded')).toBeTruthy();

    fireEvent.click(within(lessons).getByRole('button', { name: /Edit Reviewing full-lengths/ }));
    fireEvent.change(screen.getByLabelText('Video link'), { target: { value: 'https://vimeo.com/123456789' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save lesson' }));
    expect(await within(lessons).findByText('Vimeo')).toBeTruthy();

    fireEvent.click(within(lessons).getByRole('button', { name: /^Publish Reviewing full-lengths/ }));
    await within(lessons).findByRole('button', { name: /^Unpublish Reviewing full-lengths/ });
    const student = await getModuleContent('dat');
    expect(student.chapters.flatMap(chapter => chapter.lessons).some(lesson => lesson.title === 'Reviewing full-lengths')).toBe(true);
  });

  it('rejects a video link it can’t read', async () => {
    await openModule('dat', 'Full-length practice');
    const lessons = group(/Full-length practice: lessons/);
    fireEvent.click(within(lessons).getByRole('button', { name: /Edit Reviewing full-lengths/ }));
    fireEvent.change(screen.getByLabelText('Video link'), { target: { value: 'https://example.com/video' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save lesson' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Paste a Vimeo, YouTube or Mux link.');
  });

  it('uploads a new material, then deletes it after confirming', async () => {
    await openModule('casper', 'The format');
    const materials = group(/The format: materials/);
    fireEvent.click(within(materials).getByRole('button', { name: 'Add material' }));
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Timing card' } });
    fireEvent.change(screen.getByLabelText('File'), { target: { files: [new File(['x'], 'timing.pdf', { type: 'application/pdf' })] } });
    await screen.findByText('timing.pdf');
    fireEvent.click(within(materials).getByRole('button', { name: 'Add material' }));
    expect(await within(materials).findByText('Timing card')).toBeTruthy();

    fireEvent.click(within(materials).getByRole('button', { name: /Delete Timing card/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(within(materials).queryByText('Timing card')).toBeNull());
  });
});
