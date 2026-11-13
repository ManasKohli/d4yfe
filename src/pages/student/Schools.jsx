import { useState } from 'react';
import FilterPills from '../../components/FilterPills.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { schools } from '../../data/demo.js';
import { schoolsNote } from '../../data/portal.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { formatMonth } from '../../lib/format.js';

const filters = {
  All: () => true,
  Canada: school => school.country === 'Canada',
  US: school => school.country === 'US',
  'CASPer required': school => school.casper,
  MMI: school => school.interview === 'MMI',
  Kira: school => school.interview === 'Kira',
};

export default function Schools() {
  useDocumentTitle('School requirements');
  const [filter, setFilter] = useState('All');
  const visible = schools.filter(filters[filter]);

  return (
    <>
      <PageHeader eyebrow="STUDENT PORTAL" title="School requirements," muted="side by side." lede={schoolsNote}>
        <FilterPills label="Filter schools" options={Object.keys(filters)} value={filter} onChange={setFilter}/>
      </PageHeader>
      <div className="card-grid">
        {visible.map(school => (
          <article className="panel" key={school.id}>
            <div className="panel-head"><div><h2 className="card-title">{school.name}</h2><p className="muted-line">{school.place} · {school.degree}</p></div></div>
            <dl className="fact-list">
              {school.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <div className="panel-foot">
              <span>Last verified {formatMonth(school.verified)}</span>
              <a href={school.url} target="_blank" rel="noreferrer">Official page<span className="visually-hidden"> for {school.name} (opens in a new tab)</span></a>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && <p className="muted-line">No schools match this filter.</p>}
    </>
  );
}
