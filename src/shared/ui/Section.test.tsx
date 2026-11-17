import { render, screen } from '@testing-library/react';
import Section from '@/shared/ui/Section';

describe('Section', () => {
  it('labels the section with its h2', () => {
    render(<Section title="Outcomes"/>);
    const region = screen.getByRole('region', { name: 'Outcomes' });
    const heading = screen.getByRole('heading', { level: 2, name: 'Outcomes' });
    expect(region.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('keeps a label the caller passes', () => {
    render(<Section title="Outcomes" aria-label="Custom"/>);
    expect(screen.getByRole('region', { name: 'Custom' }).hasAttribute('aria-labelledby')).toBe(false);
  });

  it('centers the heading block only when asked', () => {
    const { container, rerender } = render(<Section title="Plain"/>);
    expect(container.querySelector('header')?.className).not.toContain('text-center');
    rerender(<Section title="Plain" align="center"/>);
    expect(container.querySelector('header')?.className).toContain('text-center');
  });
});
