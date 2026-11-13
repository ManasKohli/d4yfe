import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import ReviewQueueTable from './ReviewQueueTable.jsx';
import { reviewQueue } from '../../data/demo.js';
import { feedbackParts } from '../../data/portal.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function MentorReviews() {
  useDocumentTitle('Review queue');
  return (
    <>
      <PageHeader eyebrow="MENTOR AREA" title="Review queue," muted="assigned to you." lede={`Each review includes ${feedbackParts.join(', ').toLowerCase()}.`}/>
      <Panel title={`${reviewQueue.length} open reviews`}>
        <ReviewQueueTable items={reviewQueue}/>
      </Panel>
    </>
  );
}
