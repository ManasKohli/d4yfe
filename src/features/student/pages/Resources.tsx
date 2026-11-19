import { useState } from 'react';
import { moduleLabel, modules } from '@/data/modules';
import { libraryCategories, partnerDisclosure, resourceKinds } from '@/data/portal';
import LessonPlayer from '@/features/student/components/LessonPlayer';
import MaterialAction from '@/features/student/components/MaterialAction';
import { getLibrary } from '@/shared/api/mockApi';
import useAsync from '@/shared/hooks/useAsync';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { Button } from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import { Input, Select } from '@/shared/ui/Field';
import FilterPills from '@/shared/ui/FilterPills';
import { List } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';
import type { Material } from '@/types';

const trackFilters = {
  'Canada and US': () => true,
  'Canada only': (item: Material) => item.track !== 'US',
  'US only': (item: Material) => item.track !== 'Canada',
} satisfies Record<string, (item: Material) => boolean>;
type TrackFilter = keyof typeof trackFilters;
const kinds = ['All', ...resourceKinds];
const moduleOptions = [{ slug: 'start-here', title: 'Start here' }, ...modules.map(module => ({ slug: module.slug, title: `${moduleLabel(module.slug)}: ${module.title}` }))];

function ResourceRow({ item }: { item: Material }) {
  const [playing, setPlaying] = useState(false);
  const meta = [
    item.libraryCategory ? libraryCategories[item.libraryCategory] : null,
    moduleLabel(item.moduleSlug),
    item.track === 'Both' ? 'Canada and US' : item.track,
  ].filter(Boolean).join(' · ');
  return (
    <li className="py-3">
      <div className="flex min-h-14 items-center justify-between gap-4">
        <span className="min-w-0">
          <span className="block font-medium text-ink">{item.title}</span>
          <span className="block text-sm text-muted">{meta}</span>
        </span>
        <MaterialAction material={item} playing={playing} onTogglePlay={() => setPlaying(current => !current)}/>
      </div>
      {playing && item.videoProvider && <LessonPlayer provider={item.videoProvider} title={item.title}/>}
    </li>
  );
}

export default function Resources() {
  useDocumentTitle('Resources');
  const { data: library, error, loading, reload } = useAsync('library', getLibrary);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('All');
  const [module, setModule] = useState('all');
  const [track, setTrack] = useState<TrackFilter>('Canada and US');
  const needle = query.trim().toLowerCase();
  const visible = (library ?? []).filter(item =>
    (kind === 'All' || (item.libraryCategory && libraryCategories[item.libraryCategory] === kind))
    && (module === 'all' || item.moduleSlug === module)
    && trackFilters[track](item)
    && (!needle || item.title.toLowerCase().includes(needle)));

  return (
    <>
      <PageHeader title="Resources" lede="Every checklist, template, workbook, and recording from your modules."/>
      <Card>
        <div className="mb-4 grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <label htmlFor="resource-search" className="sr-only">Search resources</label>
            <Input id="resource-search" type="search" placeholder="Search resources" value={query} onChange={event => setQuery(event.target.value)}/>
            <label htmlFor="resource-module" className="sr-only">Module</label>
            <Select id="resource-module" value={module} onChange={event => setModule(event.target.value)}>
              <option value="all">All modules</option>
              {moduleOptions.map(option => <option key={option.slug} value={option.slug}>{option.title}</option>)}
            </Select>
          </div>
          <FilterPills label="Resource type" options={kinds} value={kind} onChange={setKind}/>
          <FilterPills label="Track" options={Object.keys(trackFilters) as TrackFilter[]} value={track} onChange={setTrack}/>
        </div>
        {loading && <p className="py-4 text-muted" role="status">Loading resources…</p>}
        {Boolean(error) && (
          <div className="flex flex-wrap items-center gap-3 py-4 text-warn" role="alert">
            Resources didn’t load. <Button variant="outline" onClick={reload}>Try again</Button>
          </div>
        )}
        {library && (visible.length === 0 ? <p className="py-4 text-muted">No resources match.</p> : (
          <List>{visible.map(item => <ResourceRow key={item.id} item={item}/>)}</List>
        ))}
        <p className="mt-4 border-t border-line pt-4 text-sm text-muted">{partnerDisclosure}</p>
      </Card>
    </>
  );
}
