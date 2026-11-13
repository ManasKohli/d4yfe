import { Link } from 'react-router';

/** Previous and next module links. `pathFor(slug)` decides where they go (public module page or portal module page). */
export default function ModulePagination({ previous, next, pathFor }) {
  return (
    <nav className="module-pagination" aria-label="Previous and next module">
      {previous ? <Link to={pathFor(previous.slug)}><span>PREVIOUS MODULE</span><strong>← {previous.title}</strong></Link> : <span/>}
      {next && <Link className="next-module" to={pathFor(next.slug)}><span>NEXT MODULE</span><strong>{next.title} →</strong></Link>}
    </nav>
  );
}
