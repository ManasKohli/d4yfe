import { useState } from 'react';
import { resources } from '@/data/demo.js';
import { moduleLabel } from '@/data/modules.js';
import { partnerDisclosure, resourceKinds } from '@/data/portal.js';
import FilterPills from '@/shared/components/FilterPills.jsx';
import PageHeader from '@/shared/components/PageHeader.jsx';
import Panel from '@/shared/components/Panel.jsx';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle.js';

const trackFilters = { 'Canada and US': () => true, 'Canada only': item => item.track !== 'US', 'US only': item => item.track !== 'Canada' };

export default function Resources() {
  useDocumentTitle('Resources');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('All');
  const [track, setTrack] = useState('Canada and US');
  const needle = query.trim().toLowerCase();
  const visible = resources.filter(item =>
    (kind === 'All' || item.kind === kind) && trackFilters[track](item) && (!needle || item.title.toLowerCase().includes(needle)));

  return (
    <>
      <PageHeader eyebrow="STUDENT PORTAL" title="Resources" muted="in one place." lede="Every checklist, template, workbook, and recording from your modules."/>
      <Panel>
        <div className="toolbar">
          <div className="field field-inline">
            <label htmlFor="resource-search" className="visually-hidden">Search resources</label>
            <input id="resource-search" type="search" placeholder="Search resources" value={query} onChange={event => setQuery(event.target.value)}/>
          </div>
          <FilterPills label="Resource type" options={['All', ...resourceKinds]} value={kind} onChange={setKind}/>
          <FilterPills label="Track" options={Object.keys(trackFilters)} value={track} onChange={setTrack}/>
        </div>
        {visible.length === 0 ? <p className="muted-line">No resources match.</p> : (
          <ul className="item-list">
            {visible.map(item => (
              <li key={item.id}><span>{item.title}<small className="block">{item.kind} · {moduleLabel(item.module)} · {item.track === 'Both' ? 'Canada and US' : item.track}</small></span></li>
            ))}
          </ul>
        )}
        <p className="panel-foot"><span>{partnerDisclosure}</span></p>
      </Panel>
    </>
  );
}
