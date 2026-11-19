import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import StudentModule from '@/features/student/pages/StudentModule';
import { resetMockApi } from '@/shared/api/mockApi';

function renderModule(slug: string) {
  render(
    <MemoryRouter initialEntries={[`/portal/modules/${slug}`]}>
      <Routes><Route path="/portal/modules/:slug" element={<StudentModule/>}/></Routes>
    </MemoryRouter>,
  );
}

const chapter = (title: RegExp) => screen.getByRole('region', { name: title });

beforeEach(() => resetMockApi());

describe('StudentModule content', () => {
  it('lists each chapter’s published videos with their codes, and opens the player', async () => {
    renderModule('casper');
    const scenarios = chapter(/Scenario types/);
    expect(await within(scenarios).findByText('3.5a')).toBeTruthy();
    expect(within(scenarios).getByText('5 videos', { exact: false })).toBeTruthy();
    fireEvent.click(within(scenarios).getByRole('button', { name: /Watch 3.5a/ }));
    expect(within(scenarios).getByText(/Vimeo player/)).toBeTruthy();
  });

  it('keeps a chapter with no video usable as a written lesson', async () => {
    renderModule('dat');
    const fullLengths = chapter(/Full-length practice/);
    expect(await within(fullLengths).findByRole('button', { name: /Download Practice test review log/ })).toBeTruthy();
    expect(within(fullLengths).getByText(/Written lesson/)).toBeTruthy();
    expect(within(fullLengths).getByRole('link', { name: /Open Partner platforms and codes/ })).toBeTruthy();
  });

  it('shows the full outline, without players or downloads, for a module outside the package', async () => {
    renderModule('application-entries');
    expect(await screen.findByText(/not in your package yet/)).toBeTruthy();
    const entries = chapter(/600-character entries/);
    expect(within(entries).getByText('Context, action, impact, reflection')).toBeTruthy();
    expect(within(entries).getByText('Weak vs strong entries')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /^Watch/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Download/ })).toBeNull();
  });
});
