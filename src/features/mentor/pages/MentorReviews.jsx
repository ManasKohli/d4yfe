import { reviewQueue } from '@/data/demo.js';
import { feedbackParts } from '@/data/portal.js';
import ReviewQueueTable from '@/features/mentor/components/ReviewQueueTable.jsx';
import PageHeader from '@/shared/components/PageHeader.jsx';
import Panel from '@/shared/components/Panel.jsx';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle.js';

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
