import { reviewQueue } from '@/data/demo';
import { feedbackParts } from '@/data/portal';
import ReviewQueueTable from '@/features/mentor/components/ReviewQueueTable';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import PageHeader from '@/shared/ui/PageHeader';

export default function MentorReviews() {
  useDocumentTitle('Review queue');
  return (
    <>
      <PageHeader title="Review queue" lede={`${reviewQueue.length} open. Each review includes ${feedbackParts.join(', ').toLowerCase()}.`}/>
      <ReviewQueueTable items={reviewQueue}/>
    </>
  );
}
