import { Navigate, Route, Routes } from 'react-router';
import ScrollManager from './components/ScrollManager.jsx';
import { adminUser, mentor, student } from './data/demo.js';
import AppShell from './layouts/AppShell.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ModulePage from './pages/ModulePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProgramDetailsPage from './pages/ProgramDetailsPage.jsx';
import AdminHardship from './pages/admin/AdminHardship.jsx';
import AdminMentors from './pages/admin/AdminMentors.jsx';
import AdminOverview from './pages/admin/AdminOverview.jsx';
import AdminReviews from './pages/admin/AdminReviews.jsx';
import AdminStudents from './pages/admin/AdminStudents.jsx';
import MentorAvailability from './pages/mentor/MentorAvailability.jsx';
import MentorDashboard from './pages/mentor/MentorDashboard.jsx';
import MentorHours from './pages/mentor/MentorHours.jsx';
import MentorReview from './pages/mentor/MentorReview.jsx';
import MentorReviews from './pages/mentor/MentorReviews.jsx';
import Assignments from './pages/student/Assignments.jsx';
import Community from './pages/student/Community.jsx';
import Feedback from './pages/student/Feedback.jsx';
import Resources from './pages/student/Resources.jsx';
import Schools from './pages/student/Schools.jsx';
import Sessions from './pages/student/Sessions.jsx';
import StudentHome from './pages/student/StudentHome.jsx';
import StudentModule from './pages/student/StudentModule.jsx';
import { paths } from './routes.js';

export default function App() {
  return (
    <>
      <ScrollManager/>
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

        <Route path={paths.student} element={<AppShell area="student" basePath={paths.student} user={student}/>}>
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

        <Route path={paths.mentor} element={<AppShell area="mentor" basePath={paths.mentor} user={mentor}/>}>
          <Route index element={<MentorDashboard/>}/>
          <Route path="reviews" element={<MentorReviews/>}/>
          <Route path="reviews/:id" element={<MentorReview/>}/>
          <Route path="availability" element={<MentorAvailability/>}/>
          <Route path="hours" element={<MentorHours/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Route>

        <Route path={paths.admin} element={<AppShell area="admin" basePath={paths.admin} user={adminUser}/>}>
          <Route index element={<AdminOverview/>}/>
          <Route path="students" element={<AdminStudents/>}/>
          <Route path="mentors" element={<AdminMentors/>}/>
          <Route path="reviews" element={<AdminReviews/>}/>
          <Route path="hardship" element={<AdminHardship/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Route>
      </Routes>
    </>
  );
}
