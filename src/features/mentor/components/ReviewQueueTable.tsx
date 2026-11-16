import { Link } from 'react-router';
import { mentorReviewPath } from '@/app/paths';
import { formatDay } from '@/shared/lib/format';
import Badge from '@/shared/ui/Badge';
import Table from '@/shared/ui/Table';
import type { QueueItem } from '@/types';

export default function ReviewQueueTable({ items }: { items: QueueItem[] }) {
  return (
    <Table
      caption="Reviews assigned to you"
      rows={items}
      rowKey={item => item.id}
      empty="No reviews waiting. New submissions appear here when students send work."
      columns={[
        { header: 'Assignment', cell: item => <Link to={mentorReviewPath(item.id)} className="font-medium text-ink hover:underline">{item.title}</Link> },
        { header: 'Student', cell: item => item.student },
        { header: 'Track', cell: item => item.track, hideOnPhone: true },
        { header: 'Due', cell: item => formatDay(item.due) },
        { header: 'Status', cell: item => <Badge status={item.status}/> },
      ]}
    />
  );
}
