import { demoToday, openReviews } from '@/data/demo';
import { escalationRule } from '@/data/portal';
import { reviewAge } from '@/features/admin/reviewAge';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { formatDay } from '@/shared/lib/format';
import Badge from '@/shared/ui/Badge';
import PageHeader from '@/shared/ui/PageHeader';
import Table from '@/shared/ui/Table';

export default function AdminReviews() {
  useDocumentTitle('Reviews');
  const rows = openReviews
    .map(review => ({ ...review, ...reviewAge(review, demoToday) }))
    .sort((a, b) => b.days - a.days);
  const ruleText = escalationRule.map(rule => `${rule.action.toLowerCase()} on day ${rule.day}`).join(', ');

  return (
    <>
      <PageHeader title="Reviews in progress" lede={`Overdue reviews escalate automatically: ${ruleText}.`}/>
      <Table
        caption="Open reviews, oldest first"
        rows={rows}
        rowKey={row => row.id}
        empty="No open reviews."
        columns={[
          { header: 'Assignment', cell: row => <span className="font-medium">{row.title}</span> },
          { header: 'Student', cell: row => row.student },
          { header: 'Mentor', cell: row => row.mentor, hideOnPhone: true },
          { header: 'Submitted', cell: row => formatDay(row.submitted), hideOnPhone: true },
          { header: 'Days open', cell: row => <span className="tabular-nums">{row.days}</span> },
          { header: 'Escalation', cell: row => (row.step ? <Badge label={row.step.action} tone="warn"/> : <Badge label="On time"/>) },
        ]}
      />
    </>
  );
}
