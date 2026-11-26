import { useRef, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { paths } from '@/app/paths';
import { reviewQueue } from '@/data/demo';
import { findModule, moduleLabel } from '@/data/modules';
import { rubricScale, rubrics, uploadRules } from '@/data/portal';
import { ApiError, completeReview, requestFeedbackUploadUrl } from '@/shared/api/mockApi';
import FileUpload from '@/shared/components/FileUpload';
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
import type { SubmissionItem, UploadedFile } from '@/types';

const scale = Array.from({ length: rubricScale }, (_, index) => index + 1);
const legend = 'mb-3 text-sm font-semibold tracking-wider text-accent uppercase';

function ReviewForm({ reviewId, criteria }: { reviewId: string; criteria: string[] }) {
  const [result, setResult] = useState<string | null>(null);
  const [commented, setCommented] = useState<UploadedFile | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const action = useRef<'send' | 'flag'>('send');
  if (result) return <p className="rounded-field bg-done-soft p-3" role="status">{result}</p>;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (action.current === 'flag') {
      setResult('Flagged to the program coordinator.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await completeReview(reviewId, { feedbackFilePath: commented?.path ?? null });
      setResult(`Feedback sent to the student${commented ? ', with your commented document' : ''}. Your volunteer hours are logged.`);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Feedback didn’t send. Try again.');
      setSending(false);
    }
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
      <FileUpload
        id="commented"
        label="Commented document (optional)"
        bucket="feedback"
        requestUrl={name => requestFeedbackUploadUrl(reviewId, name)}
        onChange={setCommented}
        onBusyChange={setUploading}
        hint={`A marked-up copy of the student’s file. ${uploadRules.feedback.hint}`}
      />
      {error && <p className="text-sm text-warn" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={sending || uploading} onClick={() => { action.current = 'send'; }}>{sending ? 'Sending…' : uploading ? 'Uploading…' : 'Submit feedback'}</Button>
        <Button type="submit" variant="outline" formNoValidate disabled={sending} onClick={() => { action.current = 'flag'; }}>Flag to coordinator</Button>
      </div>
    </form>
  );
}

/** The student's answers: files to open, video links, and typed text. */
function Answers({ answers }: { answers: SubmissionItem[] }) {
  return (
    <List>
      {answers.map(answer => {
        if (answer.kind === 'video_link') {
          return (
            <ListRow key={answer.label} title={answer.label} meta={<span className="break-all">{answer.videoUrl}</span>} trailing={
              <a href={answer.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-blue hover:underline">
                Open video <Icon name="external" size={16}/>
              </a>
            }/>
          );
        }
        if (answer.kind === 'text') return <ListRow key={answer.label} title={answer.label} meta={answer.body}/>;
        return <ListRow key={answer.label} title={answer.fileName} trailing={<span className="text-sm text-muted">Student file</span>}/>;
      })}
    </List>
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
          <Answers answers={review.answers}/>
          <h3 className={`mt-5 ${legend}`}>Note from the student</h3>
          <p className="text-muted">{review.note || 'No note.'}</p>
        </Card>
        <Card title="Your feedback">
          <ReviewForm reviewId={review.id} criteria={rubrics[review.module] ?? []}/>
        </Card>
      </div>
    </>
  );
}
