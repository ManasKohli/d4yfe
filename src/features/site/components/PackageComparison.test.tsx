import { render, screen, within } from '@testing-library/react';
import PackageComparison from '@/features/site/components/PackageComparison';

const labels = { feature: 'Feature', included: 'Included', notIncluded: 'Not included' };

function renderTable() {
  return render(
    <>
      <h2 id="compare">Compare</h2>
      <PackageComparison
        labelledBy="compare"
        labels={labels}
        packages={[{ name: 'Basic', summary: 'Basic summary' }, { name: 'Plus', summary: 'Plus summary' }]}
        features={[
          { label: 'Workshops', values: [true, true] },
          { label: 'Feedback', values: [false, 'Selected'] },
        ]}
      />
    </>,
  );
}

describe('PackageComparison', () => {
  it('is a table named by its heading, with package column headers and feature row headers', () => {
    renderTable();
    const table = screen.getByRole('table', { name: 'Compare' });
    const rowHeaders = within(table).getAllByRole('rowheader');
    expect(rowHeaders.map(th => th.textContent)).toEqual(['Workshops', 'Feedback']);
    rowHeaders.forEach(th => expect(th.getAttribute('scope')).toBe('row'));
    expect(within(table).getByRole('columnheader', { name: /Plus/ }).getAttribute('scope')).toBe('col');
  });

  it('gives boolean cells screen-reader text and renders string qualifiers', () => {
    renderTable();
    const table = screen.getByRole('table');
    const workshops = within(table).getByRole('row', { name: /Workshops/ });
    const feedback = within(table).getByRole('row', { name: /Feedback/ });
    expect(within(workshops).getAllByText('Included')).toHaveLength(2);
    expect(within(feedback).getByText('Not included')).toBeTruthy();
    expect(within(feedback).getByText('Selected')).toBeTruthy();
  });
});
