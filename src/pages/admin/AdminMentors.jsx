import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import { mentors } from '../../data/demo.js';
import { mentorRules } from '../../data/portal.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function AdminMentors() {
  useDocumentTitle('Mentors');
  return (
    <>
      <PageHeader eyebrow="D4Y ADMIN" title="Mentors" muted="and reviewers." lede={mentorRules.slice(0, 2).join(' ')}/>
      <Panel title={`${mentors.length} mentors`}>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Mentor</th><th scope="col">Role</th><th scope="col" className="num">Students</th><th scope="col" className="num">Reviews this month</th><th scope="col" className="num">Hours</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {mentors.map(mentor => (
                <tr key={mentor.id}>
                  <td>{mentor.name}</td><td>{mentor.role}</td><td className="num">{mentor.students}</td>
                  <td className="num">{mentor.reviewsThisMonth} of {mentor.limit}</td><td className="num">{mentor.hours}</td>
                  <td><StatusPill status={mentor.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
