import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/app/ErrorBoundary';

function Throws(): never {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('shows the recovery page when a child throws, and clears it on navigation', () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<ErrorBoundary resetKey="/a"><Throws/></ErrorBoundary>);
    expect(screen.getByRole('button', { name: 'Reload' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to overview' }).getAttribute('href')).toBe('/');

    rerender(<ErrorBoundary resetKey="/b"><p>Next page</p></ErrorBoundary>);
    expect(screen.getByText('Next page')).toBeTruthy();
    quiet.mockRestore();
  });
});
