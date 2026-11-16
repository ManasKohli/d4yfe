import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import PillNav from '@/shared/ui/PillNav';

function renderNav() {
  return render(
    <MemoryRouter>
      <PillNav label="Main" brand={<span>Brand</span>} links={[{ label: 'Modules', to: '/modules' }]} actions={<a href="/login">Sign in</a>}/>
    </MemoryRouter>,
  );
}

describe('PillNav phone menu', () => {
  it('opens, moves focus into the panel, and closes on Escape with focus returned', () => {
    renderNav();
    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    act(() => toggle.click());
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const panelLinks = screen.getAllByRole('link', { name: 'Modules' });
    expect(document.activeElement).toBe(panelLinks.at(-1));

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Menu' }));
  });

  it('closes when a link in the panel is followed', () => {
    renderNav();
    act(() => screen.getByRole('button', { name: 'Menu' }).click());
    act(() => screen.getAllByRole('link', { name: 'Modules' }).at(-1)?.click());
    expect(screen.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded')).toBe('false');
  });
});
