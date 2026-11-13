import { useState } from 'react';
import { Link, useParams } from 'react-router';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import { reviewQueue } from '../../data/demo.js';
import { findModule, moduleLabel } from '../../data/modules.js';
import { rubricScale, rubrics } from '../../data/portal.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { formatDay } from '../../lib/format.js';
import { paths } from '../../routes.js';
import NotFoundPage from '../NotFoundPage.jsx';

const scale = Array.from({ length: rubricScale }, (_, index) => index + 1);

function ReviewForm({ criteria }) {
  const [result, setResult] = useState(null);
  if (result) return <p className="callout" role="status">{result}</p>;

  const handleSubmit = event => {
    event.preventDefault();
    const action = event.nativeEvent.submitter?.value;
    setResult(action === 'flag' ? 'Flagged to the program coordinator.' : 'Feedback sent to the student. Your volunteer hours are logged.');
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <fieldset className="rubric-input">
        <legend>Rubric, scored 1 to {rubricScale}</legend>
        {criteria.map((criterion, index) => (
          <div className="field field-row" key={criterion}>
            <label htmlFor={`score-${index}`}>{criterion}</label>
            <select id={`score-${index}`} name={criterion} required defaultValue="">
              <option value="" disabled>Score</option>
              {scale.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
        ))}
      </fieldset>
      <div className="field"><label htmlFor="strengths">Strengths</label><textarea id="strengths" rows={3} required/></div>
      <fieldset className="form-stack">
        <legend>Top three priorities</legend>
        {[1, 2, 3].map(number => (
          <div className="field" key={number}><label htmlFor={`priority-${number}`} className="visually-hidden">Priority {number}</label><input id={`priority-${number}`} placeholder={`Priority ${number}`} required/></div>
        ))}
      </fieldset>
      <div className="field"><label htmlFor="question">One follow-up question</label><input id="question" required/></div>
      <div className="field">
        <label htmlFor="commented">Commented document <span className="optional">(optional)</span></label>
        <input id="commented" type="file" accept=".pdf,.doc,.docx"/>
      </div>
      <div className="button-row">
        <button className="button button-dark button-compact" type="submit" value="send">Submit feedback</button>
        <button className="button button-outline button-compact" type="submit" value="flag" formNoValidate>Flag to coordinator</button>
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
      <Link className="breadcrumb-link" to={`${paths.mentor}/reviews`}>← Review queue</Link>
      <PageHeader eyebrow={`${moduleLabel(review.module).toUpperCase()} · ${module.title.toUpperCase()}`} title={review.title} muted={review.student}>
        <div className="head-meta"><StatusPill status={review.status}/><span className="muted-line">{review.track} track · Submitted {formatDay(review.submitted)} · Due {formatDay(review.due)}</span></div>
      </PageHeader>
      <div className="app-layout app-layout-list">
        <Panel title="Submission">
          <ul className="item-list"><li><span>{review.file}</span><small>Student file</small></li></ul>
          <h3 className="sub-label">Note from the student</h3>
          <p className="body-text">{review.note || 'No note.'}</p>
        </Panel>
        <Panel title="Your feedback">
          <ReviewForm criteria={rubrics[review.module] ?? []}/>
        </Panel>
      </div>
    </>
  );
}
