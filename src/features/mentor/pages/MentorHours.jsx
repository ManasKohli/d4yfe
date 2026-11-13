import { volunteerLog } from '@/data/demo.js';
import PageHeader from '@/shared/components/PageHeader.jsx';
import Panel from '@/shared/components/Panel.jsx';
import StatList from '@/shared/components/StatList.jsx';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle.js';
import { formatDay } from '@/shared/lib/format.js';

export default function MentorHours() {
  useDocumentTitle('Volunteer record');
  const total = volunteerLog.reduce((sum, entry) => sum + entry.hours, 0);
  const reviews = volunteerLog.filter(entry => entry.activity.startsWith('Review')).length;
  const sessions = volunteerLog.filter(entry => entry.activity.startsWith('Session')).length;

  return (
    <>
      <PageHeader eyebrow="MENTOR AREA" title="Volunteer record," muted="logged for you." lede="Hours log automatically from completed reviews and sessions."/>
      <StatList label="Totals" stats={[
        { label: 'Total hours', value: total },
        { label: 'Reviews', value: reviews },
        { label: 'Sessions', value: sessions },
      ]}/>
      <Panel title="Log">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Date</th><th scope="col">Activity</th><th scope="col">Student</th><th scope="col" className="num">Hours</th></tr></thead>
            <tbody>
              {volunteerLog.map(entry => (
                <tr key={entry.id}><td>{formatDay(entry.date)}</td><td>{entry.activity}</td><td>{entry.student ?? '—'}</td><td className="num">{entry.hours}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
