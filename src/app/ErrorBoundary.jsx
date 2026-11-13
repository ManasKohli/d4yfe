import { Component } from 'react';
import { paths } from '@/app/paths.js';

/**
 * Catches render errors anywhere below it and shows a recovery page instead of a blank screen.
 * Also covers a failed lazy chunk load (for example, after a deploy replaces old asset files).
 * Uses a plain <a> so the link works even if the router itself is what failed.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Replace with an error reporting service when one is chosen.
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main id="main" className="support-page-intro section-wrap">
        <h1>Something went<br/><em>wrong.</em></h1>
        <p>This page could not load. Reload to try again, or go back to the program overview.</p>
        <div className="hero-actions">
          <button className="button button-dark" type="button" onClick={() => window.location.reload()}>Reload</button>
          <a className="text-link" href={paths.home}>Back to overview</a>
        </div>
      </main>
    );
  }
}
