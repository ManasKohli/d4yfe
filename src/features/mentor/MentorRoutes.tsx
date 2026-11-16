import { Route, Routes } from 'react-router';
import { paths } from '@/app/paths';
import { mentor } from '@/data/demo';
import MentorAvailability from '@/features/mentor/pages/MentorAvailability';
import MentorDashboard from '@/features/mentor/pages/MentorDashboard';
import MentorHours from '@/features/mentor/pages/MentorHours';
import MentorReview from '@/features/mentor/pages/MentorReview';
import MentorReviews from '@/features/mentor/pages/MentorReviews';
import NotFoundPage from '@/shared/components/NotFoundPage';
import AppShell from '@/shared/layouts/AppShell';

/** Mentor area routes, mounted at /mentor/*. Loaded on demand. */
export default function MentorRoutes() {
  return (
    <Routes>
      <Route element={<AppShell area="mentor" basePath={paths.mentor} user={mentor}/>}>
        <Route index element={<MentorDashboard/>}/>
        <Route path="reviews" element={<MentorReviews/>}/>
        <Route path="reviews/:id" element={<MentorReview/>}/>
        <Route path="availability" element={<MentorAvailability/>}/>
        <Route path="hours" element={<MentorHours/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Route>
    </Routes>
  );
}
