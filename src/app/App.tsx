import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import ErrorBoundary from '@/app/ErrorBoundary';
import { programDetailsRedirect } from '@/app/legacyRedirects';
import { paths } from '@/app/paths';
import ScrollManager from '@/app/ScrollManager';
import LoginPage from '@/features/auth/LoginPage';
import HomePage from '@/features/site/pages/HomePage';
import ModulePage from '@/features/site/pages/ModulePage';
import HowItWorksPage from '@/features/site/pages/HowItWorksPage';
import MentorsPage from '@/features/site/pages/MentorsPage';
import PackagesPage from '@/features/site/pages/PackagesPage';
import PublicLayout from '@/features/site/PublicLayout';
import NotFoundPage from '@/shared/components/NotFoundPage';

// Each signed-in area is its own chunk, so public visitors never download portal code.
const StudentRoutes = lazy(() => import('@/features/student/StudentRoutes'));
const MentorRoutes = lazy(() => import('@/features/mentor/MentorRoutes'));
const AdminRoutes = lazy(() => import('@/features/admin/AdminRoutes'));

const loading = <p className="sr-only" role="status">Loading</p>;

/** The old one-page program details URL, sent to whichever new page holds the linked section. */
function ProgramDetailsRedirect() {
  const { hash } = useLocation();
  return <Navigate to={programDetailsRedirect(hash)} replace/>;
}

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
            <Route path={paths.howItWorks} element={<HowItWorksPage/>}/>
            <Route path={paths.packages} element={<PackagesPage/>}/>
            <Route path={paths.mentors} element={<MentorsPage/>}/>
            <Route path="/program-details" element={<ProgramDetailsRedirect/>}/>
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
