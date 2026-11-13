import { Route, Routes } from 'react-router';
import { paths } from '@/app/paths.js';
import { adminUser } from '@/data/demo.js';
import AdminHardship from '@/features/admin/pages/AdminHardship.jsx';
import AdminMentors from '@/features/admin/pages/AdminMentors.jsx';
import AdminOverview from '@/features/admin/pages/AdminOverview.jsx';
import AdminReviews from '@/features/admin/pages/AdminReviews.jsx';
import AdminStudents from '@/features/admin/pages/AdminStudents.jsx';
import NotFoundPage from '@/shared/components/NotFoundPage.jsx';
import AppShell from '@/shared/layouts/AppShell.jsx';

/** Admin routes, mounted at /admin/*. Loaded on demand. */
export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AppShell area="admin" basePath={paths.admin} user={adminUser}/>}>
        <Route index element={<AdminOverview/>}/>
        <Route path="students" element={<AdminStudents/>}/>
        <Route path="mentors" element={<AdminMentors/>}/>
        <Route path="reviews" element={<AdminReviews/>}/>
        <Route path="hardship" element={<AdminHardship/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Route>
    </Routes>
  );
}
