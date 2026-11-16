import { Component, type ErrorInfo, type ReactNode } from 'react';
import { paths } from '@/app/paths';
import { Button } from '@/shared/ui/Button';
import { buttonClass } from '@/shared/ui/buttonClass';
import PageHeader from '@/shared/ui/PageHeader';

interface State { error: Error | null }

/**
 * Catches render errors anywhere below it and shows a recovery page instead of a blank screen.
 * Also covers a failed lazy chunk load (for example, after a deploy replaces old asset files).
 * Uses a plain <a> so the link works even if the router itself is what failed.
 */
export default class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(previous: { resetKey?: string }) {
    // Navigating away (including Back/Forward) clears the error so the next page can render.
    if (this.state.error && previous.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with an error reporting service when one is chosen.
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main id="main" className="container-page py-20">
        <PageHeader title="Something went" muted="wrong." lede="This page could not load. Reload to try again, or go back to the program overview.">
          <Button onClick={() => window.location.reload()}>Reload</Button>
          <a className={buttonClass('outline')} href={paths.home}>Back to overview</a>
        </PageHeader>
      </main>
    );
  }
}
