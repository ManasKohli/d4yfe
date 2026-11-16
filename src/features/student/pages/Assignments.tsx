import { useState, type FormEvent } from 'react';
import { portalFeedbackPath } from '@/app/paths';
import { assignments as initialAssignments, student } from '@/data/demo';
import { findModule, moduleLabel } from '@/data/modules';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { formatDay, todayLocal } from '@/shared/lib/format';
import Badge from '@/shared/ui/Badge';
import { Button, ButtonLink } from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import { Field, Input, Textarea } from '@/shared/ui/Field';
import FilterPills from '@/shared/ui/FilterPills';
import { List, ListRow } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';
import type { Assignment } from '@/types';

const filters = {
  All: () => true,
  'To do': (item: Assignment) => item.status === 'not-started' || item.status === 'revise',
  'In review': (item: Assignment) => item.status === 'submitted' || item.status === 'in-review',
  'Feedback ready': (item: Assignment) => item.status === 'feedback-ready',
} satisfies Record<string, (item: Assignment) => boolean>;
type Filter = keyof typeof filters;
const filterNames = Object.keys(filters) as Filter[];

const canSubmit = (item: Assignment) => item.status === 'not-started' || item.status === 'revise';

function SubmissionForm({ assignment, onSubmit }: { assignment: Assignment; onSubmit: (id: string) => void }) {
  const [error, setError] = useState('');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = new FormData(event.currentTarget).get('file');
    if (!(file instanceof File) || !file.name) {
      setError('Choose a file to upload.');
      return;
    }
    setError('');
    onSubmit(assignment.id);
  };
  return (
    <form className="mt-5 grid gap-4" onSubmit={handleSubmit} noValidate>
      <Field label="Your file" htmlFor="file" hint="PDF or Word document.">
        <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx" aria-invalid={error ? true : undefined}/>
      </Field>
      <Field label="Note to your mentor (optional)" htmlFor="note">
        <Textarea id="note" name="note" rows={3}/>
      </Field>
      {error && <p className="text-sm text-warn" role="alert">{error}</p>}
      <div><Button type="submit">Submit for review</Button></div>
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
      <PageHeader eyebrow="Student portal" title="Assignments" lede="Everything you have submitted or still owe, and where each item is in review."/>
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
