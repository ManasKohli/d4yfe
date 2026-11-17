import { useRef, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { paths } from '@/app/paths';
import { reviewQueue } from '@/data/demo';
import { findModule, moduleLabel } from '@/data/modules';
import { rubricScale, rubrics } from '@/data/portal';
import NotFoundPage from '@/shared/components/NotFoundPage';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { formatDay } from '@/shared/lib/format';
import Badge from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import { Field, Input, Select, Textarea } from '@/shared/ui/Field';
import Icon from '@/shared/ui/Icon';
import { List, ListRow } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';

const scale = Array.from({ length: rubricScale }, (_, index) => index + 1);
const legend = 'mb-3 text-sm font-semibold tracking-wider text-accent uppercase';

function ReviewForm({ criteria }: { criteria: string[] }) {
  const [result, setResult] = useState<string | null>(null);
  const action = useRef<'send' | 'flag'>('send');
  if (result) return <p className="rounded-field bg-done-soft p-3" role="status">{result}</p>;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(action.current === 'flag' ? 'Flagged to the program coordinator.' : 'Feedback sent to the student. Your volunteer hours are logged.');
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <fieldset>
        <legend className={legend}>Rubric, scored 1 to {rubricScale}</legend>
        <div className="grid gap-3">
          {criteria.map((criterion, index) => (
            <div key={criterion} className="grid items-center gap-2 md:grid-cols-[minmax(0,1fr)_8rem]">
              <label htmlFor={`score-${index}`}>{criterion}</label>
              <Select id={`score-${index}`} name={criterion} required defaultValue="">
                <option value="" disabled>Score</option>
                {scale.map(value => <option key={value} value={value}>{value}</option>)}
              </Select>
            </div>
          ))}
        </div>
      </fieldset>
      <Field label="Strengths" htmlFor="strengths"><Textarea id="strengths" rows={3} required/></Field>
      <fieldset>
        <legend className={legend}>Top three priorities</legend>
        <div className="grid gap-3">
          {[1, 2, 3].map(number => (
            <Field key={number} label={`Priority ${number}`} htmlFor={`priority-${number}`}><Input id={`priority-${number}`} required/></Field>
          ))}
        </div>
      </fieldset>
      <Field label="One follow-up question" htmlFor="question"><Input id="question" required/></Field>
      <Field label="Commented document (optional)" htmlFor="commented"><Input id="commented" type="file" accept=".pdf,.doc,.docx"/></Field>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" onClick={() => { action.current = 'send'; }}>Submit feedback</Button>
        <Button type="submit" variant="outline" formNoValidate onClick={() => { action.current = 'flag'; }}>Flag to coordinator</Button>
      </div>
    </form>
  );
}

export default function MentorReview() {
  const { id } = useParams();
  const review = reviewQueue.find(item => item.id === id);
  useDocumentTitle(review ? `Review: ${review.title}` : 'Review not found');
  if (!review) return <NotFoundPage/>;
  const module = findModule(review.module);

  return (
    <>
      <Link className="mb-6 inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink" to={`${paths.mentor}/reviews`}>
        <span className="rotate-180"><Icon name="arrow" size={16}/></span> Review queue
      </Link>
      <PageHeader eyebrow={`${moduleLabel(review.module)} · ${module?.title ?? ''}`} title={review.title} lede={review.student}>
        <Badge status={review.status}/>
        <span className="text-sm text-muted">{review.track} track · Submitted {formatDay(review.submitted)} · Due {formatDay(review.due)}</span>
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Card title="Submission" className="self-start">
          <List><ListRow title={review.file} trailing={<span className="text-sm text-muted">Student file</span>}/></List>
          <h3 className={`mt-5 ${legend}`}>Note from the student</h3>
          <p className="text-muted">{review.note || 'No note.'}</p>
        </Card>
        <Card title="Your feedback">
          <ReviewForm criteria={rubrics[review.module] ?? []}/>
        </Card>
      </div>
    </>
  );
}
