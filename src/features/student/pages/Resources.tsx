import { useState } from 'react';
import { resources } from '@/data/demo';
import { moduleLabel } from '@/data/modules';
import { partnerDisclosure, resourceKinds } from '@/data/portal';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import Card from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Field';
import FilterPills from '@/shared/ui/FilterPills';
import { List, ListRow } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';
import type { Resource } from '@/types';

const trackFilters = {
  'Canada and US': () => true,
  'Canada only': (item: Resource) => item.track !== 'US',
  'US only': (item: Resource) => item.track !== 'Canada',
} satisfies Record<string, (item: Resource) => boolean>;
type TrackFilter = keyof typeof trackFilters;
const kinds = ['All', ...resourceKinds];

export default function Resources() {
  useDocumentTitle('Resources');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('All');
  const [track, setTrack] = useState<TrackFilter>('Canada and US');
  const needle = query.trim().toLowerCase();
  const visible = resources.filter(item =>
    (kind === 'All' || item.kind === kind) && trackFilters[track](item) && (!needle || item.title.toLowerCase().includes(needle)));

  return (
    <>
      <PageHeader eyebrow="Student portal" title="Resources" lede="Every checklist, template, workbook, and recording from your modules."/>
      <Card>
        <div className="mb-4 grid gap-3">
          <label htmlFor="resource-search" className="sr-only">Search resources</label>
          <Input id="resource-search" type="search" placeholder="Search resources" value={query} onChange={event => setQuery(event.target.value)} className="md:max-w-sm"/>
          <FilterPills label="Resource type" options={kinds} value={kind} onChange={setKind}/>
          <FilterPills label="Track" options={Object.keys(trackFilters) as TrackFilter[]} value={track} onChange={setTrack}/>
        </div>
        {visible.length === 0 ? <p className="py-4 text-muted">No resources match.</p> : (
          <List>
            {visible.map(item => (
              <ListRow key={item.id} title={item.title} meta={`${item.kind} · ${moduleLabel(item.module)} · ${item.track === 'Both' ? 'Canada and US' : item.track}`}/>
            ))}
          </List>
        )}
        <p className="mt-4 border-t border-line pt-4 text-sm text-muted">{partnerDisclosure}</p>
      </Card>
    </>
  );
}
