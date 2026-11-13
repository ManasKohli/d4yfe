import { Navigate, Route, Routes } from 'react-router';
import ScrollManager from './components/ScrollManager.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import HomePage from './pages/HomePage.jsx';
import ModulePage from './pages/ModulePage.jsx';
import ProgramDetailsPage from './pages/ProgramDetailsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { paths } from './routes.js';

export default function App() {
  return (
    <>
      <ScrollManager />
      <SiteHeader />
      <main id="main">
        <Routes>
          <Route path={paths.home} element={<HomePage />} />
          <Route path="/modules" element={<Navigate to={paths.modulesSection} replace />} />
          <Route path="/modules/:slug" element={<ModulePage />} />
          <Route path={paths.programDetails} element={<ProgramDetailsPage />} />
          <Route path="/application-support" element={<Navigate to={paths.modulesSection} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
