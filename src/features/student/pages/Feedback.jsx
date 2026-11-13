import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { portalFeedbackPath } from '@/app/paths.js';
import { assignments, feedback } from '@/data/demo.js';
import { moduleLabel } from '@/data/modules.js';
import { rubricScale } from '@/data/portal.js';
import PageHeader from '@/shared/components/PageHeader.jsx';
import Panel from '@/shared/components/Panel.jsx';
import ProgressBar from '@/shared/components/ProgressBar.jsx';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle.js';
import { formatDay } from '@/shared/lib/format.js';

const titleFor = entry => assignments.find(item => item.id === entry.assignmentId)?.title ?? 'Assignment';

function HelpfulnessRating() {
  const [rating, setRating] = useState(null);
  return (
    <fieldset className="rating">
      <legend>How helpful was this feedback?</legend>
      <div>
        {[1, 2, 3, 4, 5].map(value => (
          <label key={value}><input type="radio" name="helpful" value={value} checked={rating === value} onChange={() => setRating(value)}/><span>{value}</span></label>
        ))}
      </div>
      <small>{rating ? 'Thanks. ' : ''}Only D4Y admins see this rating.</small>
    </fieldset>
  );
}

function FollowUp({ question }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  if (sent) return <p className="callout" role="status">Sent to your mentor.</p>;
  return (
    <div className="stack-sm">
      <p className="body-text"><strong>Your mentor asks:</strong> {question}</p>
      {open ? (
        <form className="form-stack" onSubmit={event => { event.preventDefault(); setSent(true); }}>
          <div className="field"><label htmlFor="follow-up">Your reply</label><textarea id="follow-up" rows={3} required/></div>
          <div><button className="button button-dark button-compact" type="submit">Send</button></div>
        </form>
      ) : (
        <div><button className="button button-outline button-compact" type="button" onClick={() => setOpen(true)}>Reply</button></div>
      )}
    </div>
  );
}

function FeedbackDetail({ entry }) {
  return (
    <Panel label={`${moduleLabel(entry.module)} · ${formatDay(entry.date)}`} title={titleFor(entry)}>
      <p className="muted-line">Reviewed by {entry.reviewer}, {entry.reviewerRole.toLowerCase()}</p>
      <h3 className="sub-label">Rubric</h3>
      <dl className="rubric">
        {Object.entries(entry.scores).map(([criterion, score]) => (
          <div key={criterion}>
            <dt>{criterion}</dt>
            <dd><span>{score} / {rubricScale}</span><ProgressBar value={score} max={rubricScale} label={criterion}/></dd>
          </div>
        ))}
      </dl>
      <h3 className="sub-label">Strengths</h3>
      <p className="body-text">{entry.strengths}</p>
      <h3 className="sub-label">Top three priorities</h3>
      <ol className="numbered">{entry.priorities.map(item => <li key={item}>{item}</li>)}</ol>
      <h3 className="sub-label">Follow-up</h3>
      <FollowUp question={entry.followUp}/>
      <HelpfulnessRating/>
    </Panel>
  );
}

export default function Feedback() {
  useDocumentTitle('Feedback');
  const { id } = useParams();
  const selected = feedback.find(entry => entry.id === id) ?? feedback[0];

  return (
    <>
      <PageHeader eyebrow="STUDENT PORTAL" title="Feedback" muted="from your mentors." lede="Every review uses the same rubric: scores, strengths, your top three priorities, and one follow-up question."/>
      {feedback.length === 0 ? <p className="muted-line">No feedback yet. It appears here when a mentor finishes a review.</p> : (
        <div className="app-layout app-layout-list">
          <Panel title="Reviews">
            <ul className="select-list">
              {feedback.map(entry => (
                <li key={entry.id}>
                  <Link to={portalFeedbackPath(entry.id)} aria-current={entry.id === selected.id ? 'page' : undefined}>
                    <span>{titleFor(entry)}<small className="block">{entry.reviewer} · {formatDay(entry.date)}</small></span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
          <FeedbackDetail key={selected.id} entry={selected}/>
        </div>
      )}
    </>
  );
}
