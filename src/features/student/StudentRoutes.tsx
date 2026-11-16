import { Route, Routes } from 'react-router';
import { paths } from '@/app/paths';
import { student } from '@/data/demo';
import Assignments from '@/features/student/pages/Assignments';
import Community from '@/features/student/pages/Community';
import Feedback from '@/features/student/pages/Feedback';
import Resources from '@/features/student/pages/Resources';
import Schools from '@/features/student/pages/Schools';
import Sessions from '@/features/student/pages/Sessions';
import StudentHome from '@/features/student/pages/StudentHome';
import StudentModule from '@/features/student/pages/StudentModule';
import NotFoundPage from '@/shared/components/NotFoundPage';
import AppShell from '@/shared/layouts/AppShell';

/** Student portal routes, mounted at /portal/*. Loaded on demand. */
export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={<AppShell area="student" basePath={paths.student} user={student}/>}>
        <Route index element={<StudentHome/>}/>
        <Route path="modules/:slug" element={<StudentModule/>}/>
        <Route path="assignments" element={<Assignments/>}/>
        <Route path="feedback" element={<Feedback/>}/>
        <Route path="feedback/:id" element={<Feedback/>}/>
        <Route path="sessions" element={<Sessions/>}/>
        <Route path="resources" element={<Resources/>}/>
        <Route path="schools" element={<Schools/>}/>
        <Route path="community" element={<Community/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Route>
    </Routes>
  );
}
