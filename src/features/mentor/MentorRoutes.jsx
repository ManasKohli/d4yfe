import { Route, Routes } from 'react-router';
import { paths } from '@/app/paths.js';
import { mentor } from '@/data/demo.js';
import MentorAvailability from '@/features/mentor/pages/MentorAvailability.jsx';
import MentorDashboard from '@/features/mentor/pages/MentorDashboard.jsx';
import MentorHours from '@/features/mentor/pages/MentorHours.jsx';
import MentorReview from '@/features/mentor/pages/MentorReview.jsx';
import MentorReviews from '@/features/mentor/pages/MentorReviews.jsx';
import NotFoundPage from '@/shared/components/NotFoundPage.jsx';
import AppShell from '@/shared/layouts/AppShell.jsx';

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
