import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StatList from '../../components/StatList.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import { bookable, sessions, student } from '../../data/demo.js';
import { sessionRules } from '../../data/portal.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { formatDateTime, viewerTimeZone } from '../../lib/format.js';

export default function Sessions() {
  useDocumentTitle('Sessions');
  const [requested, setRequested] = useState([]);
  const sorted = [...sessions].sort((a, b) => a.start.localeCompare(b.start));

  return (
    <>
      <PageHeader eyebrow="STUDENT PORTAL" title="Sessions" muted="and bookings." lede="Workshops, office hours, accountability groups, and one-on-one sessions in one calendar."/>
      <StatList label="Your sessions" stats={[
        { label: 'One-on-one sessions left', value: `${student.oneOnOnes.left} of ${student.oneOnOnes.total}` },
        { label: 'Upcoming', value: sessions.length },
        { label: 'Time zone', value: viewerTimeZone() },
      ]}/>
      <div className="app-layout">
        <Panel title="Upcoming">
          <ul className="item-list">
            {sorted.map(session => (
              <li key={session.id}>
                <span>{session.title}<small className="block">{formatDateTime(session.start)} · {session.kind}</small></span>
                <StatusPill status={session.status} label={session.status === 'booked' ? 'Booked' : 'On your calendar'}/>
              </li>
            ))}
          </ul>
          <p className="panel-foot"><span>{sessionRules.reminders} {sessionRules.reschedule}</span></p>
        </Panel>
        <Panel title="Book a session">
          <ul className="item-list">
            {bookable.map(option => {
              const isRequested = requested.includes(option.id);
              return (
                <li key={option.id}>
                  <span>{option.title}<small className="block">{option.opens ?? `${option.minutes} minutes`}</small></span>
                  {option.opens ? <StatusPill status="upcoming" label="Not open"/> : (
                    <button className="button button-outline button-compact" type="button" disabled={isRequested} onClick={() => setRequested(current => [...current, option.id])}>
                      {isRequested ? 'Requested' : 'Request a time'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </>
  );
}
