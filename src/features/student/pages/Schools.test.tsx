import { fireEvent, render, screen } from '@testing-library/react';
import Schools from '@/features/student/pages/Schools';

// jsdom has no canvas; the globe draws nothing and the page still works.
beforeEach(() => vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null));

const schoolButton = (name: string) => screen.getByRole('button', { name: new RegExp(name) });
const schoolCard = (name: string) => screen.getByRole('heading', { name }).closest('article')!;

describe('Schools globe selection', () => {
  it('marks the chosen school in the list and on its card, and links to the card', () => {
    render(<Schools/>);
    fireEvent.click(schoolButton('McGill University'));
    expect(schoolButton('McGill University').getAttribute('aria-pressed')).toBe('true');
    expect(schoolCard('McGill University').getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('link', { name: /See requirements/ }).getAttribute('href')).toBe('#school-mcgill');
  });

  it('clears the choice when the same school is pressed again', () => {
    render(<Schools/>);
    fireEvent.click(schoolButton('McGill University'));
    fireEvent.click(schoolButton('McGill University'));
    expect(schoolButton('McGill University').getAttribute('aria-pressed')).toBe('false');
    expect(schoolCard('McGill University').hasAttribute('aria-current')).toBe(false);
  });

  it('drops a choice the filter hides', () => {
    render(<Schools/>);
    fireEvent.click(schoolButton('NYU College of Dentistry'));
    fireEvent.click(screen.getByRole('button', { name: 'Canada' }));
    expect(screen.queryByRole('button', { name: /NYU College/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /See requirements/ })).toBeNull();
    expect(screen.getByRole('img', { name: 'A globe with 3 school locations' })).toBeTruthy();
  });
});
