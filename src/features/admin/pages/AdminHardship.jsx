import { hardshipApplications } from '@/data/demo.js';
import PageHeader from '@/shared/components/PageHeader.jsx';
import Panel from '@/shared/components/Panel.jsx';
import StatusPill from '@/shared/components/StatusPill.jsx';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle.js';
import { formatDay } from '@/shared/lib/format.js';

export default function AdminHardship() {
  useDocumentTitle('Hardship seats');
  return (
    <>
      <PageHeader eyebrow="D4Y ADMIN" title="Hardship seats," muted="reviewed blind." lede="Two committee members review each application. Applications are identified by number only."/>
      <Panel title={`${hardshipApplications.length} applications`}>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Application</th><th scope="col">Submitted</th><th scope="col">Reviewers</th><th scope="col">Outcome</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {hardshipApplications.map(application => (
                <tr key={application.id}>
                  <td>{application.id}</td><td>{formatDay(application.submitted)}</td>
                  <td className="num">{application.reviewsDone} of {application.reviewsNeeded}</td>
                  <td>{application.outcome ?? '—'}</td>
                  <td><StatusPill status={application.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
