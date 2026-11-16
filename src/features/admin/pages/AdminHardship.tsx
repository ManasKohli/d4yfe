import { hardshipApplications } from '@/data/demo';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { formatDay } from '@/shared/lib/format';
import Badge from '@/shared/ui/Badge';
import PageHeader from '@/shared/ui/PageHeader';
import Table from '@/shared/ui/Table';

export default function AdminHardship() {
  useDocumentTitle('Hardship seats');
  return (
    <>
      <PageHeader eyebrow="D4Y admin" title="Hardship seats" lede="Two committee members review each application. Applications are identified by number only."/>
      <Table
        caption="Hardship seat applications"
        rows={hardshipApplications}
        rowKey={application => application.id}
        empty="No hardship applications."
        columns={[
          { header: 'Application', cell: application => <span className="font-medium">{application.id}</span> },
          { header: 'Submitted', cell: application => formatDay(application.submitted) },
          { header: 'Reviewers', cell: application => <span className="tabular-nums">{application.reviewsDone} of {application.reviewsNeeded}</span> },
          { header: 'Outcome', cell: application => application.outcome ?? 'Pending', hideOnPhone: true },
          { header: 'Status', cell: application => <Badge status={application.status}/> },
        ]}
      />
    </>
  );
}
