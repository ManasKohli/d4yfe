import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import { demoToday, openReviews } from '../../data/demo.js';
import { escalationRule } from '../../data/portal.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { formatDay } from '../../lib/format.js';
import { reviewAge } from '../../lib/reviews.js';

export default function AdminReviews() {
  useDocumentTitle('Reviews');
  const rows = openReviews
    .map(review => ({ ...review, ...reviewAge(review, demoToday) }))
    .sort((a, b) => b.days - a.days);
  const ruleText = escalationRule.map(rule => `${rule.action.toLowerCase()} on day ${rule.day}`).join(', ');

  return (
    <>
      <PageHeader eyebrow="D4Y ADMIN" title="Reviews" muted="in progress." lede={`Overdue reviews escalate automatically: ${ruleText}.`}/>
      <Panel title={`${rows.length} open reviews`}>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Student</th><th scope="col">Assignment</th><th scope="col">Mentor</th><th scope="col">Submitted</th><th scope="col" className="num">Days open</th><th scope="col">Escalation</th></tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>{row.student}</td><td>{row.title}</td><td>{row.mentor}</td><td>{formatDay(row.submitted)}</td>
                  <td className="num">{row.days}</td>
                  <td>{row.step ? <StatusPill label={row.step.action} tone="warn"/> : <StatusPill label="On time" tone="neutral"/>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
