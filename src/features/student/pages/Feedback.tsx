import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { paths, portalFeedbackPath } from '@/app/paths';
import { assignments, feedback, student } from '@/data/demo';
import { moduleLabel } from '@/data/modules';
import { rubricScale } from '@/data/portal';
import NotFoundPage from '@/shared/components/NotFoundPage';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { cn } from '@/shared/lib/cn';
import { formatDay } from '@/shared/lib/format';
import { Button } from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import { Field, Textarea } from '@/shared/ui/Field';
import { List, ListRow } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';
import ProgressBar from '@/shared/ui/ProgressBar';
import type { Feedback as FeedbackEntry } from '@/types';

const titleFor = (entry: FeedbackEntry) => assignments.find(item => item.id === entry.assignmentId)?.title ?? 'Assignment';
const subHeading = 'mt-6 mb-2 text-sm font-semibold tracking-wider text-accent uppercase';

function HelpfulnessRating() {
  const [rating, setRating] = useState<number | null>(null);
  return (
    <fieldset className="mt-8 border-t border-line pt-5">
      <legend className="mb-3 font-medium">How helpful was this feedback?</legend>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(value => (
          <label key={value} className={cn(
            'grid size-11 cursor-pointer place-items-center rounded-full border text-ui has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-green',
            rating === value ? 'border-green bg-green text-white' : 'border-line-strong bg-card',
          )}>
            <input type="radio" name="helpful" value={value} checked={rating === value} onChange={() => setRating(value)} className="sr-only"/>
            {value}
          </label>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">{rating ? 'Thanks. ' : ''}Only D4Y admins see this rating.</p>
    </fieldset>
  );
}

function FollowUp({ question }: { question: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  if (sent) return <p className="rounded-field bg-done-soft p-3" role="status">Sent to your mentor.</p>;
  return (
    <div className="grid gap-3">
      <p><strong>Your mentor asks:</strong> {question}</p>
      {open ? (
        <form className="grid gap-3" onSubmit={event => { event.preventDefault(); setSent(true); }}>
          <Field label="Your reply" htmlFor="follow-up"><Textarea id="follow-up" rows={3} required/></Field>
          <div><Button type="submit">Send</Button></div>
        </form>
      ) : (
        <div><Button variant="outline" onClick={() => setOpen(true)}>Reply</Button></div>
      )}
    </div>
  );
}

function FeedbackDetail({ entry }: { entry: FeedbackEntry }) {
  return (
    <Card label={`${moduleLabel(entry.module)} · ${formatDay(entry.date)}`} title={titleFor(entry)} className="self-start">
      <p className="text-sm text-muted">Reviewed by {entry.reviewer}, {entry.reviewerRole.toLowerCase()}</p>
      <h3 className={subHeading}>Rubric</h3>
      <dl className="grid gap-3">
        {Object.entries(entry.scores).map(([criterion, score]) => (
          <div key={criterion} className="grid gap-1.5">
            <div className="flex justify-between gap-4"><dt>{criterion}</dt><dd className="text-sm text-muted">{score} / {rubricScale}</dd></div>
            <ProgressBar value={score} max={rubricScale} label={criterion}/>
          </div>
        ))}
      </dl>
      <h3 className={subHeading}>Strengths</h3>
      <p>{entry.strengths}</p>
      <h3 className={subHeading}>Top three priorities</h3>
      <ol className="grid list-decimal gap-1.5 pl-5">{entry.priorities.map(item => <li key={item}>{item}</li>)}</ol>
      <h3 className={subHeading}>Follow-up</h3>
      <FollowUp question={entry.followUp}/>
      <HelpfulnessRating/>
    </Card>
  );
}

export default function Feedback() {
  useDocumentTitle('Feedback');
  const { id } = useParams();
  const selected = id ? feedback.find(entry => entry.id === id) : feedback[0];
  if (id && !selected) return <NotFoundPage/>;

  return (
    <>
      <PageHeader eyebrow="Student portal" title="Feedback" lede="Every review uses the same rubric: scores, strengths, your top three priorities, and one follow-up question."/>
      {!selected ? (
        <Card>
          <p>No feedback yet. Reviews come back within {student.mentorTurnaroundDays} days of submitting.</p>
          <Link to={`${paths.student}/assignments`} className="mt-3 inline-flex min-h-11 items-center font-medium text-green hover:underline">Go to assignments</Link>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Card title="Reviews" className="self-start">
            <List>
              {feedback.map(entry => (
                <ListRow key={entry.id} title={titleFor(entry)} meta={`${entry.reviewer} · ${formatDay(entry.date)}`} to={portalFeedbackPath(entry.id)} selected={entry.id === selected.id}/>
              ))}
            </List>
          </Card>
          <FeedbackDetail key={selected.id} entry={selected}/>
        </div>
      )}
    </>
  );
}
