import { useState, type FormEvent } from 'react';
import { portalFeedbackPath } from '@/app/paths';
import { assignments as initialAssignments, student } from '@/data/demo';
import { findModule, moduleLabel } from '@/data/modules';
import { videoAnswer } from '@/data/portal';
import { ApiError, requestSubmissionUploadUrl, submitAssignment } from '@/shared/api/mockApi';
import FileUpload from '@/shared/components/FileUpload';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { formatDay, todayLocal } from '@/shared/lib/format';
import { isAllowedAnswerLink } from '@/shared/lib/videoLinks';
import Badge from '@/shared/ui/Badge';
import { Button, ButtonLink } from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import { Field, Input, Textarea } from '@/shared/ui/Field';
import FilterPills from '@/shared/ui/FilterPills';
import { List, ListRow } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';
import type { AnswerKind, Assignment, SubmissionItem, UploadedFile } from '@/types';

const filters = {
  All: () => true,
  'To do': (item: Assignment) => item.status === 'not-started' || item.status === 'revise',
  'In review': (item: Assignment) => item.status === 'submitted' || item.status === 'in-review',
  'Feedback ready': (item: Assignment) => item.status === 'feedback-ready',
} satisfies Record<string, (item: Assignment) => boolean>;
type Filter = keyof typeof filters;
const filterNames = Object.keys(filters) as Filter[];

const canSubmit = (item: Assignment) => item.status === 'not-started' || item.status === 'revise';

type Answer = { kind: AnswerKind; label: string; file: UploadedFile | null; text: string };

/** Labels in the order the assignment lists them: "Video 1", "Typed 2"; a lone file is just "Your file". */
function answersFor(spec: AnswerKind[]): Answer[] {
  const counts: Partial<Record<AnswerKind, number>> = {};
  const totals = spec.reduce<Partial<Record<AnswerKind, number>>>((sum, kind) => ({ ...sum, [kind]: (sum[kind] ?? 0) + 1 }), {});
  return spec.map(kind => {
    const number = (counts[kind] = (counts[kind] ?? 0) + 1);
    const label = kind === 'file' ? (totals.file === 1 ? 'Your file' : `File ${number}`) : kind === 'video_link' ? `Video ${number}` : `Typed answer ${number}`;
    return { kind, label, file: null, text: '' };
  });
}

/** The first problem with the answers, or '' when they're ready to send. */
function problemWith(answers: Answer[]): string {
  for (const answer of answers) {
    if (answer.kind === 'file' && !answer.file) return answers.length === 1 ? 'Choose a file to upload.' : `${answer.label}: choose a file to upload.`;
    if (answer.kind === 'video_link' && !isAllowedAnswerLink(answer.text)) return `${answer.label}: paste a link from ${videoAnswer.hosts}.`;
    if (answer.kind === 'text' && !answer.text.trim()) return `${answer.label}: write your answer.`;
  }
  return '';
}

const toItem = (answer: Answer): SubmissionItem => (
  answer.kind === 'file' ? { kind: 'file', label: answer.label, path: answer.file?.path, fileName: answer.file?.fileName }
    : answer.kind === 'video_link' ? { kind: 'video_link', label: answer.label, videoUrl: answer.text.trim() }
      : { kind: 'text', label: answer.label, body: answer.text.trim() }
);

function SubmissionForm({ assignment, onSubmit }: { assignment: Assignment; onSubmit: (id: string) => void }) {
  const [answers, setAnswers] = useState(() => answersFor(assignment.answerSpec));
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState('');
  /** Answers whose file is still uploading; submit waits for them (review finding 1). */
  const [uploading, setUploading] = useState<Set<number>>(() => new Set());
  const setBusy = (index: number, busy: boolean) => setUploading(current => {
    const next = new Set(current);
    if (busy) next.add(index); else next.delete(index);
    return next;
  });
  const update = (index: number, change: Partial<Answer>) => setAnswers(current => current.map((answer, at) => (at === index ? { ...answer, ...change } : answer)));
  const hasVideo = answers.some(answer => answer.kind === 'video_link');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = problemWith(answers);
    setError(problem);
    if (problem) return;
    setSending(true);
    try {
      await submitAssignment(assignment.id, answers.map(toItem), note);
      onSubmit(assignment.id);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Your answers didn’t send. Try again.');
      setSending(false);
    }
  };

  return (
    <form className="mt-5 grid gap-4" onSubmit={handleSubmit} noValidate>
      {hasVideo && <p className="text-sm text-muted">{videoAnswer.hint}</p>}
      {answers.map((answer, index) => {
        const id = `answer-${index}`;
        if (answer.kind === 'file') {
          return (
            <FileUpload
              key={id}
              id={id}
              label={answer.label}
              bucket="submissions"
              requestUrl={name => requestSubmissionUploadUrl(assignment.id, name)}
              onChange={file => update(index, { file })}
              onBusyChange={busy => setBusy(index, busy)}
              invalid={Boolean(error) && !answer.file}
            />
          );
        }
        if (answer.kind === 'video_link') {
          return (
            <Field key={id} label={`${answer.label} link`} htmlFor={id}>
              <Input id={id} type="url" inputMode="url" placeholder="https://" value={answer.text} onChange={event => update(index, { text: event.target.value })}/>
            </Field>
          );
        }
        return (
          <Field key={id} label={answer.label} htmlFor={id}>
            <Textarea id={id} rows={4} value={answer.text} onChange={event => update(index, { text: event.target.value })}/>
          </Field>
        );
      })}
      <Field label="Note to your mentor (optional)" htmlFor="note">
        <Textarea id="note" name="note" rows={3} value={note} onChange={event => setNote(event.target.value)}/>
      </Field>
      {error && <p className="text-sm text-warn" role="alert">{error}</p>}
      <div><Button type="submit" disabled={sending || uploading.size > 0}>{sending ? 'Submitting…' : uploading.size > 0 ? 'Uploading…' : 'Submit for review'}</Button></div>
    </form>
  );
}

function AssignmentDetail({ assignment, onSubmit }: { assignment: Assignment; onSubmit: (id: string) => void }) {
  const module = findModule(assignment.module);
  return (
    <Card label={`${moduleLabel(assignment.module)} · ${module?.title ?? ''}`} title={assignment.title} action={<Badge status={assignment.status}/>} className="self-start">
      {assignment.instructions && <p className="text-muted">{assignment.instructions}</p>}
      {canSubmit(assignment) && <SubmissionForm key={assignment.id} assignment={assignment} onSubmit={onSubmit}/>}
      {assignment.status === 'submitted' && (
        <p className="mt-4 rounded-field bg-done-soft p-3" role="status">Submitted. In review. Your mentor usually responds within {student.mentorTurnaroundDays} days.</p>
      )}
      {assignment.status === 'in-review' && <p className="text-muted">Your mentor is reviewing this. Mentors usually respond within {student.mentorTurnaroundDays} days.</p>}
      {assignment.feedbackId && <ButtonLink className="mt-4" to={portalFeedbackPath(assignment.feedbackId)}>Read feedback</ButtonLink>}
    </Card>
  );
}

export default function Assignments() {
  useDocumentTitle('Assignments');
  const [items, setItems] = useState(initialAssignments);
  const [filter, setFilter] = useState<Filter>('All');
  const [selectedId, setSelectedId] = useState(initialAssignments.find(canSubmit)?.id ?? initialAssignments[0]?.id);
  const visible = items.filter(filters[filter]);
  const selected = items.find(item => item.id === selectedId);

  const submit = (id: string) => setItems(current => current.map(item => (
    item.id === id ? { ...item, status: 'submitted', dateLabel: 'Submitted', date: todayLocal() } : item
  )));

  return (
    <>
      <PageHeader title="Assignments" lede="Everything you have submitted or still owe, and where each item is in review."/>
      <div className="mb-5"><FilterPills label="Filter assignments" options={filterNames} value={filter} onChange={setFilter}/></div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card title="All assignments" className="self-start">
          {visible.length === 0 ? <p className="text-muted">Nothing in this filter.</p> : (
            <List>
              {visible.map(item => (
                <ListRow
                  key={item.id}
                  title={item.title}
                  meta={`${moduleLabel(item.module)} · ${item.dateLabel} ${formatDay(item.date)}`}
                  trailing={<Badge status={item.status}/>}
                  onSelect={() => setSelectedId(item.id)}
                  selected={item.id === selectedId}
                />
              ))}
            </List>
          )}
          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-4 text-sm text-muted">
            <span>Review rounds left: {student.reviewRounds.total - student.reviewRounds.used} of {student.reviewRounds.total}</span>
            <span>Mentor turnaround: {student.mentorTurnaroundDays} days</span>
          </p>
        </Card>
        {selected && <AssignmentDetail assignment={selected} onSubmit={submit}/>}
      </div>
    </>
  );
}
