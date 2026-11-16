import type { ReactNode } from 'react';

interface Stat { label: string; value: ReactNode }

/** A row of headline numbers from real records. */
export default function StatList({ stats, label }: { stats: Stat[]; label: string }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4" aria-label={label}>
      {stats.map(stat => (
        <div key={stat.label} className="bg-card p-4 md:p-5">
          <dt className="text-sm text-muted">{stat.label}</dt>
          <dd className="mt-1 font-display text-2xl font-bold">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
