import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import ErrorBoundary from '@/app/ErrorBoundary';
import { paths } from '@/app/paths';
import ScrollManager from '@/app/ScrollManager';
import LoginPage from '@/features/auth/LoginPage';
import HomePage from '@/features/site/pages/HomePage';
import ModulePage from '@/features/site/pages/ModulePage';
import ProgramDetailsPage from '@/features/site/pages/ProgramDetailsPage';
import PublicLayout from '@/features/site/PublicLayout';
import NotFoundPage from '@/shared/components/NotFoundPage';

// Each signed-in area is its own chunk, so public visitors never download portal code.
const StudentRoutes = lazy(() => import('@/features/student/StudentRoutes'));
const MentorRoutes = lazy(() => import('@/features/mentor/MentorRoutes'));
const AdminRoutes = lazy(() => import('@/features/admin/AdminRoutes'));

const loading = <p className="sr-only" role="status">Loading</p>;

/** Top-level route table. Public pages load up front; each signed-in area owns its own routes. */
export default function App() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary resetKey={pathname}>
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
