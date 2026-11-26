import { Link } from 'react-router';
import { paths } from '@/app/paths';
import { cohort, completedReviewsThisMonth, demoToday, hardshipApplications, mentors, openReviews, roster } from '@/data/demo';
import { escalationRule } from '@/data/portal';
import { reviewAge } from '@/features/admin/reviewAge';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import Badge from '@/shared/ui/Badge';
import Card from '@/shared/ui/Card';
import { List, ListRow } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';
import StatList from '@/shared/ui/StatList';

const panelLink = 'text-sm font-medium text-blue hover:underline';

export default function AdminOverview() {
  useDocumentTitle('Admin');
  const ages = openReviews.map(review => reviewAge(review, demoToday));
  const firstEscalation = escalationRule[0]?.day ?? 0;
  const pipeline = [
    { label: `Under ${firstEscalation} days`, value: ages.filter(age => !age.step).length },
    { label: 'Escalated', value: ages.filter(age => age.step).length },
    { label: 'Completed this month', value: completedReviewsThisMonth },
  ];
  const pendingHardship = hardshipApplications.filter(application => application.status === 'pending');

  return (
    <>
      <PageHeader title="Program overview" lede={cohort.name}/>
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Review pipeline" action={<Link className={panelLink} to={`${paths.admin}/reviews`}>All reviews</Link>}>
            <List>{pipeline.map(row => <ListRow key={row.label} title={row.label} trailing={<span className="font-display text-lg font-bold tabular-nums">{row.value}</span>}/>)}</List>
            <h3 className="mt-5 mb-3 text-sm font-semibold tracking-wider text-accent uppercase">Escalation rule</h3>
            <ol className="grid gap-2">
              {escalationRule.map(rule => (
                <li key={rule.day} className="flex gap-3"><strong className="w-16 shrink-0">Day {rule.day}</strong><span className="text-muted">{rule.action}</span></li>
              ))}
            </ol>
          </Card>
          <Card title="Hardship seats" action={<Link className={panelLink} to={`${paths.admin}/hardship`}>All applications</Link>}>
            {hardshipApplications.length === 0 ? <p className="text-muted">No hardship applications.</p> : (
              <List>
                {hardshipApplications.map(application => (
                  <ListRow
                    key={application.id}
                    title={`Application ${application.id}`}
                    meta={application.outcome ? `Approved · ${application.outcome}` : `Blind review · ${application.reviewsDone} of ${application.reviewsNeeded} reviewers`}
                    trailing={<Badge status={application.status}/>}
                  />
                ))}
              </List>
            )}
          </Card>
        </div>
        <StatList label="Program" stats={[
          { label: 'Cohort filled', value: `${roster.length} of ${cohort.capacity}` },
          { label: 'Active mentors', value: mentors.filter(item => item.status === 'active').length },
          { label: 'Open reviews', value: openReviews.length },
          { label: 'Hardship pending', value: pendingHardship.length },
        ]}/>
      </div>
    </>
  );
}
