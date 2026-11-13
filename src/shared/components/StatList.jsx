/** A row of headline numbers. `stats` is a list of { label, value }. */
export default function StatList({ stats, label }) {
  return (
    <dl className="stat-list" aria-label={label}>
      {stats.map(stat => (
        <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>
      ))}
    </dl>
  );
}
