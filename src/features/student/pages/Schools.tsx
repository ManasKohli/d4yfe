import { useState } from 'react';
import { schools } from '@/data/demo';
import { schoolsNote } from '@/data/portal';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { formatMonth } from '@/shared/lib/format';
import FilterPills from '@/shared/ui/FilterPills';
import Icon from '@/shared/ui/Icon';
import PageHeader from '@/shared/ui/PageHeader';
import type { School } from '@/types';

const filters = {
  All: () => true,
  Canada: (school: School) => school.country === 'Canada',
  US: (school: School) => school.country === 'US',
  'CASPer required': (school: School) => school.casper,
  MMI: (school: School) => school.interview === 'MMI',
  Kira: (school: School) => school.interview === 'Kira',
} satisfies Record<string, (school: School) => boolean>;
type Filter = keyof typeof filters;

export default function Schools() {
  useDocumentTitle('School requirements');
  const [filter, setFilter] = useState<Filter>('All');
  const visible = schools.filter(filters[filter]);

  return (
    <>
      <PageHeader title="School requirements" lede={schoolsNote}/>
      <div className="mb-6"><FilterPills label="Filter schools" options={Object.keys(filters) as Filter[]} value={filter} onChange={setFilter}/></div>
      {visible.length === 0 ? <p className="text-muted">No schools match this filter.</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map(school => (
            <article key={school.id} className="flex flex-col rounded-card border border-line bg-card p-5 md:p-6">
              <h2 className="text-lg">{school.name}</h2>
              <p className="text-sm text-muted">{school.place} · {school.degree}</p>
              <dl className="mt-4 flex-1 divide-y divide-line">
                {school.facts.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2"><dt className="text-muted">{label}</dt><dd className="text-right">{value}</dd></div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-sm">
                <span className="text-muted">Last verified {formatMonth(school.verified)}</span>
                <a href={school.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-medium text-green hover:underline">
                  Official page <Icon name="external" size={16}/><span className="sr-only"> for {school.name} (opens in a new tab)</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
