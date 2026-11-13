import { Link } from 'react-router';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StatList from '../../components/StatList.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import { cohort, completedReviewsThisMonth, demoToday, hardshipApplications, mentors, openReviews, roster } from '../../data/demo.js';
import { escalationRule } from '../../data/portal.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { reviewAge } from '../../lib/reviews.js';
import { paths } from '../../routes.js';

export default function AdminOverview() {
  useDocumentTitle('Admin');
  const ages = openReviews.map(review => reviewAge(review, demoToday));
  const firstEscalation = escalationRule[0].day;
  const pipeline = [
    { label: 'Under ' + firstEscalation + ' days', value: ages.filter(age => !age.step).length },
    { label: 'Escalated', value: ages.filter(age => age.step).length },
    { label: 'Completed this month', value: completedReviewsThisMonth },
  ];
  const pendingHardship = hardshipApplications.filter(application => application.status === 'pending');

  return (
    <>
      <PageHeader eyebrow="D4Y ADMIN" title="Program overview," muted={cohort.name.toLowerCase() + '.'}/>
      <StatList label="Program" stats={[
        { label: 'Cohort filled', value: `${roster.length} of ${cohort.capacity}` },
        { label: 'Active mentors', value: mentors.filter(item => item.status === 'active').length },
        { label: 'Open reviews', value: openReviews.length },
        { label: 'Hardship applications pending', value: pendingHardship.length },
      ]}/>
      <div className="app-layout app-layout-even">
        <Panel title="Review pipeline" action={<Link className="panel-link" to={`${paths.admin}/reviews`}>All reviews</Link>}>
          <ul className="item-list">{pipeline.map(row => <li key={row.label}><span>{row.label}</span><strong className="num">{row.value}</strong></li>)}</ul>
          <h3 className="sub-label">Escalation rule</h3>
          <ol className="steps">
            {escalationRule.map(rule => <li key={rule.day}><strong>Day {rule.day}</strong><span>{rule.action}</span></li>)}
          </ol>
        </Panel>
        <Panel title="Hardship seats" action={<Link className="panel-link" to={`${paths.admin}/hardship`}>All applications</Link>}>
          <ul className="item-list">
            {hardshipApplications.map(application => (
              <li key={application.id}>
                <span>Application {application.id}<small className="block">{application.outcome ? `Approved · ${application.outcome}` : `Blind review · ${application.reviewsDone} of ${application.reviewsNeeded} reviewers`}</small></span>
                <StatusPill status={application.status}/>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
