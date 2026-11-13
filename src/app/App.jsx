import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import ErrorBoundary from '@/app/ErrorBoundary.jsx';
import { paths } from '@/app/paths.js';
import ScrollManager from '@/app/ScrollManager.jsx';
import LoginPage from '@/features/auth/LoginPage.jsx';
import HomePage from '@/features/site/pages/HomePage.jsx';
import ModulePage from '@/features/site/pages/ModulePage.jsx';
import ProgramDetailsPage from '@/features/site/pages/ProgramDetailsPage.jsx';
import PublicLayout from '@/features/site/PublicLayout.jsx';
import NotFoundPage from '@/shared/components/NotFoundPage.jsx';

// Each signed-in area is its own chunk, so public visitors never download portal code.
const StudentRoutes = lazy(() => import('@/features/student/StudentRoutes.jsx'));
const MentorRoutes = lazy(() => import('@/features/mentor/MentorRoutes.jsx'));
const AdminRoutes = lazy(() => import('@/features/admin/AdminRoutes.jsx'));

const loading = <p className="visually-hidden" role="status">Loading</p>;

/** Top-level route table. Public pages load up front; each signed-in area owns its own routes. */
export default function App() {
  return (
    <ErrorBoundary>
      <ScrollManager/>
      <Suspense fallback={loading}>
        <Routes>
          <Route element={<PublicLayout/>}>
            <Route path={paths.home} element={<HomePage/>}/>
            <Route path="/modules" element={<Navigate to={paths.modulesSection} replace/>}/>
            <Route path="/modules/:slug" element={<ModulePage/>}/>
            <Route path={paths.programDetails} element={<ProgramDetailsPage/>}/>
            <Route path={paths.login} element={<LoginPage/>}/>
            <Route path="/application-support" element={<Navigate to={paths.modulesSection} replace/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
          </Route>

          <Route path={`${paths.student}/*`} element={<StudentRoutes/>}/>
          <Route path={`${paths.mentor}/*`} element={<MentorRoutes/>}/>
          <Route path={`${paths.admin}/*`} element={<AdminRoutes/>}/>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
