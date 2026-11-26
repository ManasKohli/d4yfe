import { useMemo, useState } from 'react';
import { schools } from '@/data/demo';
import { schoolGlobe, schoolsNote } from '@/data/portal';
import SchoolGlobe from '@/features/student/components/SchoolGlobe';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { cn } from '@/shared/lib/cn';
import { formatMonth } from '@/shared/lib/format';
import Card from '@/shared/ui/Card';
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

const cardId = (school: School) => `school-${school.id}`;

export default function Schools() {
  useDocumentTitle('School requirements');
  const [filter, setFilter] = useState<Filter>('All');
  const [chosenId, setChosenId] = useState<string | null>(null);
  const visible = useMemo(() => schools.filter(filters[filter]), [filter]);
  const pins = useMemo(() => visible.map(({ id, name, coordinates }) => ({ id, name, ...coordinates })), [visible]);
  // A school hidden by the filter can't stay chosen.
  const chosen = visible.find(school => school.id === chosenId) ?? null;
  const toggle = (id: string) => setChosenId(current => (current === id ? null : id));

  return (
    <>
      <PageHeader title="School requirements" lede={schoolsNote}/>
      <div className="mb-6"><FilterPills label="Filter schools" options={Object.keys(filters) as Filter[]} value={filter} onChange={setFilter}/></div>
      {visible.length === 0 ? <p className="text-muted">No schools match this filter.</p> : (
        <>
          <Card title={schoolGlobe.title} className="mb-6">
            <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,26rem)_1fr]">
              <div className="mx-auto w-full max-w-sm lg:max-w-none">
                <SchoolGlobe pins={pins} selectedId={chosen?.id ?? null} onSelect={setChosenId} label={schoolGlobe.imageLabel(pins.length)}/>
              </div>
              <div>
                <p className="mb-4 text-sm text-muted">{schoolGlobe.hint}</p>
                <ul aria-label={schoolGlobe.listLabel} className="grid gap-2">
                  {visible.map(school => {
                    const active = school.id === chosen?.id;
                    return (
                      <li key={school.id}>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggle(school.id)}
                          className={cn(
                            'flex min-h-11 w-full items-center justify-between gap-3 rounded-field border px-4 py-2 text-left transition-colors',
                            active ? 'border-blue bg-blue-soft' : 'border-line bg-card hover:border-line-strong',
                          )}
                        >
                          <span className="font-medium">{school.name}</span>
                          <span className="text-sm text-muted">{school.place}</span>
                        </button>
                        {active && (
                          <a href={`#${cardId(school)}`} className="mt-1 inline-flex min-h-11 items-center px-4 text-sm font-medium text-blue hover:underline">
                            {schoolGlobe.jump}<span className="sr-only"> for {school.name}</span>
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {visible.map(school => (
              <article
                key={school.id}
                id={cardId(school)}
                aria-current={school.id === chosen?.id ? 'true' : undefined}
                className={cn(
                  'flex flex-col rounded-card border bg-card p-5 transition-[border-color,box-shadow] duration-300 md:p-6',
                  school.id === chosen?.id ? 'border-blue shadow-lift' : 'border-line',
                )}
              >
                <h2 className="text-lg">{school.name}</h2>
                <p className="text-sm text-muted">{school.place} · {school.degree}</p>
                <dl className="mt-4 flex-1 divide-y divide-line">
                  {school.facts.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 py-2"><dt className="text-muted">{label}</dt><dd className="text-right">{value}</dd></div>
                  ))}
                </dl>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-sm">
                  <span className="text-muted">Last verified {formatMonth(school.verified)}</span>
                  <a href={school.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-medium text-blue hover:underline">
                    Official page <Icon name="external" size={16}/><span className="sr-only"> for {school.name} (opens in a new tab)</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
