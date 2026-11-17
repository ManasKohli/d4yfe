import { render, screen } from '@testing-library/react';
import Section from '@/shared/ui/Section';

describe('Section', () => {
  it('split layout renders the header and the children', () => {
    const { container } = render(<Section layout="split" title="Portal" lede="One place"><p>Content</p></Section>);
    expect(screen.getByRole('heading', { level: 2, name: 'Portal' })).toBeTruthy();
    expect(screen.getByText('One place')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
    expect(container.querySelector('.lg\\:grid')).not.toBeNull();
  });

  it('labels the section with its h2', () => {
    render(<Section title="Outcomes"/>);
    const region = screen.getByRole('region', { name: 'Outcomes' });
    const heading = screen.getByRole('heading', { level: 2, name: 'Outcomes' });
    expect(region.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('uses a caller heading id so other elements can reference the heading', () => {
    render(<Section title="Compare" headingId="compare"/>);
    expect(screen.getByRole('heading', { level: 2, name: 'Compare' }).id).toBe('compare');
    expect(screen.getByRole('region', { name: 'Compare' }).getAttribute('aria-labelledby')).toBe('compare');
  });

  it('keeps a label the caller passes', () => {
    render(<Section title="Outcomes" aria-label="Custom"/>);
    expect(screen.getByRole('region', { name: 'Custom' }).hasAttribute('aria-labelledby')).toBe(false);
  });

  it('defaults render no grid and no rule', () => {
    const { container } = render(<Section title="Plain"><p>Body</p></Section>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('py-16');
    expect(container.querySelector('[class*="grid"]')).toBeNull();
    expect(container.querySelector('[class*="border"]')).toBeNull();
  });

  it('rule draws a hairline that replaces the top padding', () => {
    const { container } = render(<Section title="Next" rule/>);
    expect(container.querySelector('section')?.className).not.toContain('py-16');
    expect(container.querySelector('.border-t')).not.toBeNull();
  });
});
