import { Route, Routes } from 'react-router';
import { paths } from '@/app/paths.js';
import { student } from '@/data/demo.js';
import Assignments from '@/features/student/pages/Assignments.jsx';
import Community from '@/features/student/pages/Community.jsx';
import Feedback from '@/features/student/pages/Feedback.jsx';
import Resources from '@/features/student/pages/Resources.jsx';
import Schools from '@/features/student/pages/Schools.jsx';
import Sessions from '@/features/student/pages/Sessions.jsx';
import StudentHome from '@/features/student/pages/StudentHome.jsx';
import StudentModule from '@/features/student/pages/StudentModule.jsx';
import NotFoundPage from '@/shared/components/NotFoundPage.jsx';
import AppShell from '@/shared/layouts/AppShell.jsx';

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
