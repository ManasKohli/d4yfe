import { mentors } from '@/data/demo';
import { mentorRules } from '@/data/portal';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import Badge from '@/shared/ui/Badge';
import PageHeader from '@/shared/ui/PageHeader';
import Table from '@/shared/ui/Table';

export default function AdminMentors() {
  useDocumentTitle('Mentors');
  return (
    <>
      <PageHeader eyebrow="D4Y admin" title="Mentors and reviewers" lede={mentorRules.slice(0, 2).join(' ')}/>
      <Table
        caption="Mentors"
        rows={mentors}
        rowKey={mentor => mentor.id}
        empty="No mentors yet."
        columns={[
          { header: 'Mentor', cell: mentor => <span className="font-medium">{mentor.name}</span> },
          { header: 'Role', cell: mentor => mentor.role, hideOnPhone: true },
          { header: 'Students', cell: mentor => <span className="tabular-nums">{mentor.students}</span> },
          { header: 'Reviews this month', cell: mentor => <span className="tabular-nums">{mentor.reviewsThisMonth} of {mentor.limit}</span> },
          { header: 'Hours', cell: mentor => <span className="tabular-nums">{mentor.hours}</span>, hideOnPhone: true },
          { header: 'Status', cell: mentor => <Badge status={mentor.status}/> },
        ]}
      />
    </>
  );
}
