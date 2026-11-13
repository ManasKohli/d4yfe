import { useState } from 'react';
import { Link } from 'react-router';
import FilterPills from '../../components/FilterPills.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import { assignments as initialAssignments, student } from '../../data/demo.js';
import { findModule, moduleLabel } from '../../data/modules.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { formatDay } from '../../lib/format.js';
import { portalFeedbackPath } from '../../routes.js';

const filters = {
  All: () => true,
  'To do': item => item.status === 'not-started' || item.status === 'revise',
  'In review': item => item.status === 'submitted' || item.status === 'in-review',
  'Feedback ready': item => item.status === 'feedback-ready',
};

const canSubmit = item => item.status === 'not-started' || item.status === 'revise';

function SubmissionForm({ assignment, onSubmit }) {
  const [error, setError] = useState('');
  const handleSubmit = event => {
    event.preventDefault();
    const file = new FormData(event.currentTarget).get('file');
    if (!file || !file.name) {
      setError('Choose a file to upload.');
      return;
    }
    setError('');
    onSubmit(assignment.id);
  };
  return (
    <form className="form-stack" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="file">Your file</label>
        <input id="file" name="file" type="file" accept=".pdf,.doc,.docx" aria-describedby="file-hint"/>
        <small id="file-hint">PDF or Word document.</small>
      </div>
      <div className="field">
        <label htmlFor="note">Note to your mentor <span className="optional">(optional)</span></label>
        <textarea id="note" name="note" rows={3}/>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div><button className="button button-dark button-compact" type="submit">Submit for review</button></div>
    </form>
  );
}

function AssignmentDetail({ assignment, onSubmit }) {
  const module = findModule(assignment.module);
  return (
    <Panel label={`${moduleLabel(assignment.module)} · ${module.title}`} title={assignment.title} action={<StatusPill status={assignment.status}/>}>
      {assignment.instructions && <p className="body-text">{assignment.instructions}</p>}
      {canSubmit(assignment) && <SubmissionForm key={assignment.id} assignment={assignment} onSubmit={onSubmit}/>}
      {assignment.status === 'submitted' && <p className="callout" role="status">Submitted. Your mentor usually responds within {student.mentorTurnaroundDays} days.</p>}
      {assignment.status === 'in-review' && <p className="body-text">Your mentor is reviewing this. Mentors usually respond within {student.mentorTurnaroundDays} days.</p>}
      {assignment.feedbackId && <Link className="button button-dark button-compact" to={portalFeedbackPath(assignment.feedbackId)}>Read feedback</Link>}
    </Panel>
  );
}

export default function Assignments() {
  useDocumentTitle('Assignments');
  const [items, setItems] = useState(initialAssignments);
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(initialAssignments.find(canSubmit)?.id ?? initialAssignments[0]?.id);
  const visible = items.filter(filters[filter]);
  const selected = items.find(item => item.id === selectedId);

  const submit = id => setItems(current => current.map(item => item.id === id ? { ...item, status: 'submitted', dateLabel: 'Submitted', date: new Date().toISOString().slice(0, 10) } : item));

  return (
    <>
      <PageHeader eyebrow="STUDENT PORTAL" title="Assignments" muted="and submissions." lede="Everything you have submitted or still owe, and where each item is in review."/>
      <div className="app-layout">
        <Panel title="All assignments" action={<FilterPills label="Filter assignments" options={Object.keys(filters)} value={filter} onChange={setFilter}/>} className="panel-wide-head">
          {visible.length === 0 ? <p className="muted-line">Nothing here.</p> : (
            <ul className="select-list">
              {visible.map(item => (
                <li key={item.id}>
                  <button type="button" aria-current={item.id === selectedId ? 'true' : undefined} onClick={() => setSelectedId(item.id)}>
                    <span>{item.title}<small className="block">{moduleLabel(item.module)} · {item.dateLabel} {formatDay(item.date)}</small></span>
                    <StatusPill status={item.status}/>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="panel-foot">
            <span>Review rounds left: {student.reviewRounds.total - student.reviewRounds.used} of {student.reviewRounds.total}</span>
            <span>Mentor turnaround: {student.mentorTurnaroundDays} days</span>
          </div>
        </Panel>
        {selected && <AssignmentDetail assignment={selected} onSubmit={submit}/>}
      </div>
    </>
  );
}
