import { Link } from 'react-router';
import { paths } from '@/app/paths.js';
import { demoToday, mentor, reviewQueue, volunteerLog } from '@/data/demo.js';
import { mentorRules } from '@/data/portal.js';
import ReviewQueueTable from '@/features/mentor/components/ReviewQueueTable.jsx';
import PageHeader from '@/shared/components/PageHeader.jsx';
import Panel from '@/shared/components/Panel.jsx';
import StatList from '@/shared/components/StatList.jsx';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle.js';
import { daysBetween } from '@/shared/lib/format.js';

export default function MentorDashboard() {
  useDocumentTitle('Mentor dashboard');
  const firstName = mentor.name.split(' ')[0];
  const dueSoon = reviewQueue.filter(item => daysBetween(demoToday, item.due) <= 3).length;
  const hours = volunteerLog.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <>
      <PageHeader eyebrow="MENTOR AREA" title="Welcome back," muted={`${firstName}.`} lede={mentor.role}/>
      <StatList label="This month" stats={[
        { label: 'Assigned reviews', value: reviewQueue.length },
        { label: 'Due in 3 days', value: dueSoon },
        { label: 'Reviews this month', value: `${mentor.reviewsThisMonth} of ${mentor.monthlyReviewLimit}` },
        { label: 'Volunteer hours', value: hours },
      ]}/>
      <div className="app-layout">
        <Panel title="Review queue" action={<Link className="panel-link" to={`${paths.mentor}/reviews`}>Open queue</Link>}>
          <ReviewQueueTable items={reviewQueue}/>
        </Panel>
        <Panel title="How mentoring works">
          <ul className="plain-list">{mentorRules.map(rule => <li key={rule}>{rule}</li>)}</ul>
        </Panel>
      </div>
    </>
  );
}
