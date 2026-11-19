import { Route, Routes } from 'react-router';
import { paths } from '@/app/paths';
import { adminUser } from '@/data/demo';
import AdminContent from '@/features/admin/pages/AdminContent';
import AdminHardship from '@/features/admin/pages/AdminHardship';
import AdminMentors from '@/features/admin/pages/AdminMentors';
import AdminOverview from '@/features/admin/pages/AdminOverview';
import AdminReviews from '@/features/admin/pages/AdminReviews';
import AdminStudents from '@/features/admin/pages/AdminStudents';
import NotFoundPage from '@/shared/components/NotFoundPage';
import AppShell from '@/shared/layouts/AppShell';

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
        <Route path="content" element={<AdminContent/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Route>
    </Routes>
  );
}
