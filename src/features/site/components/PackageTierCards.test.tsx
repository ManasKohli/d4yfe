import { render, screen, within } from '@testing-library/react';
import PackageTierCards from '@/features/site/components/PackageTierCards';

const labels = { pricing: 'Pricing soon', included: 'Included', notIncluded: 'Not included' };

describe('PackageTierCards', () => {
  beforeEach(() => {
    render(
      <PackageTierCards
        labels={labels}
        tiers={[
          { name: 'Basic', summary: 'Basic summary', includes: [{ label: 'Workshops', value: true }, { label: 'Feedback', value: false }] },
          { name: 'Plus', summary: 'Plus summary', includes: [{ label: 'Workshops', value: true }, { label: 'Feedback', value: 'Selected' }] },
        ]}
      />,
    );
  });

  it('renders one titled card per tier, each with the pricing line and no price', () => {
    expect(screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent)).toEqual(['Basic', 'Plus']);
    expect(screen.getAllByText('Pricing soon')).toHaveLength(2);
    expect(screen.queryByText(/\$/)).toBeNull();
  });

  it('tells screen readers whether each line is included and shows qualifiers', () => {
    const basic = screen.getByRole('list', { name: 'Basic includes' });
    expect(within(basic).getByText(/Not included/)).toBeTruthy();
    const plus = screen.getByRole('list', { name: 'Plus includes' });
    expect(within(plus).getAllByText(/: Included/)).toHaveLength(2);
    expect(within(plus).getByText('Selected')).toBeTruthy();
  });
});
