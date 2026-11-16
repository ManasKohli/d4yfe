import { Link } from 'react-router';
import { paths } from '@/app/paths';
import { demoToday, mentor, reviewQueue, volunteerLog } from '@/data/demo';
import { mentorRules } from '@/data/portal';
import ReviewQueueTable from '@/features/mentor/components/ReviewQueueTable';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { daysBetween } from '@/shared/lib/format';
import Card from '@/shared/ui/Card';
import PageHeader from '@/shared/ui/PageHeader';
import StatList from '@/shared/ui/StatList';

export default function MentorDashboard() {
  useDocumentTitle('Mentor dashboard');
  const firstName = mentor.name.split(' ')[0];
  const dueSoon = reviewQueue.filter(item => daysBetween(demoToday, item.due) <= 3).length;
  const hours = volunteerLog.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <>
      <PageHeader eyebrow="Mentor area" title={`Welcome back, ${firstName}`} lede={mentor.role}/>
      <div className="grid gap-6">
        <Card title="Review queue" action={<Link className="text-sm font-medium text-green hover:underline" to={`${paths.mentor}/reviews`}>Open queue</Link>}>
          <ReviewQueueTable items={reviewQueue}/>
        </Card>
        <StatList label="This month" stats={[
          { label: 'Assigned reviews', value: reviewQueue.length },
          { label: 'Due in 3 days', value: dueSoon },
          { label: 'Reviews this month', value: `${mentor.reviewsThisMonth} of ${mentor.monthlyReviewLimit}` },
          { label: 'Volunteer hours', value: hours },
        ]}/>
        <Card title="How mentoring works">
          <ul className="grid list-disc gap-2 pl-5 text-muted marker:text-line-strong">{mentorRules.map(rule => <li key={rule}>{rule}</li>)}</ul>
        </Card>
      </div>
    </>
  );
}
