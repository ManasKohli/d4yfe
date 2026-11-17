import { render, screen, within } from '@testing-library/react';
import PackageCards from '@/features/site/components/PackageCards';

const labels = { included: 'Included', notIncluded: 'Not included' };

describe('PackageCards', () => {
  beforeEach(() => {
    render(
      <PackageCards
        labels={labels}
        packages={[{ name: 'Basic', summary: 'Basic summary' }, { name: 'Plus', summary: 'Plus summary' }]}
        features={[
          { label: 'Workshops', values: [true, true] },
          { label: 'Feedback', values: [false, 'Selected'] },
        ]}
      />,
    );
  });

  it('renders one card per package with every feature listed', () => {
    expect(screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent)).toEqual(['Basic', 'Plus']);
    const basic = screen.getByRole('list', { name: 'Basic includes' });
    expect(within(basic).getAllByRole('listitem')).toHaveLength(2);
  });

  it('gives each feature screen-reader text and shows qualifiers', () => {
    const basic = screen.getByRole('list', { name: 'Basic includes' });
    expect(within(basic).getByText(/Not included/)).toBeTruthy();
    const plus = screen.getByRole('list', { name: 'Plus includes' });
    expect(within(plus).getAllByText(/: Included/)).toHaveLength(2);
    expect(within(plus).getByText('Selected')).toBeTruthy();
  });
});
