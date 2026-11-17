import { volunteerLog } from '@/data/demo';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { formatDay } from '@/shared/lib/format';
import PageHeader from '@/shared/ui/PageHeader';
import StatList from '@/shared/ui/StatList';
import Table from '@/shared/ui/Table';

export default function MentorHours() {
  useDocumentTitle('Volunteer record');
  const total = volunteerLog.reduce((sum, entry) => sum + entry.hours, 0);
  const reviews = volunteerLog.filter(entry => entry.activity.startsWith('Review')).length;
  const sessions = volunteerLog.filter(entry => entry.activity.startsWith('Session')).length;

  return (
    <>
      <PageHeader title="Volunteer record" lede="Hours log automatically from completed reviews and sessions."/>
      <div className="grid gap-6">
        <StatList label="Totals" stats={[
          { label: 'Total hours', value: total },
          { label: 'Reviews', value: reviews },
          { label: 'Sessions', value: sessions },
        ]}/>
        <Table
          caption="Volunteer log"
          rows={volunteerLog}
          rowKey={entry => entry.id}
          empty="No hours logged yet. They appear after your first completed review or session."
          columns={[
            { header: 'Date', cell: entry => formatDay(entry.date) },
            { header: 'Activity', cell: entry => entry.activity },
            { header: 'Student', cell: entry => entry.student ?? 'None', hideOnPhone: true },
            { header: 'Hours', cell: entry => <span className="tabular-nums">{entry.hours}</span> },
          ]}
        />
      </div>
    </>
  );
}
