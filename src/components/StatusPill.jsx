import { statuses } from '../data/portal.js';

/** A status from `statuses` in src/data/portal.js, or a custom label with a tone. */
export default function StatusPill({ status, label, tone }) {
  const known = statuses[status] ?? {};
  return <span className={`status-pill tone-${tone ?? known.tone ?? 'neutral'}`}>{label ?? known.label ?? status}</span>;
}
