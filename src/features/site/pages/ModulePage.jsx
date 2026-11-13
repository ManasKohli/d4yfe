import { Link, NavLink, useParams } from 'react-router';
import { modulePath, paths } from '@/app/paths.js';
import { modules } from '@/data/modules.js';
import CurriculumSection from '@/features/site/components/CurriculumSection.jsx';
import Eyebrow from '@/shared/components/Eyebrow.jsx';
import ModulePagination from '@/shared/components/ModulePagination.jsx';
import NotFoundPage from '@/shared/components/NotFoundPage.jsx';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle.js';

function ModuleTabs() {
  return (
    <nav className="page-module-nav" aria-label="Modules">
      {modules.map(module => (
        <NavLink key={module.slug} className={({ isActive }) => isActive ? 'page-module-link active' : 'page-module-link'} to={modulePath(module.slug)}>
          <span>MODULE {module.number}</span><strong>{module.title}</strong>
        </NavLink>
      ))}
    </nav>
  );
}

function ModuleContent({ index }) {
  const module = modules[index];
  useDocumentTitle(`Module ${module.number}: ${module.title}`);
  return (
    <>
      <section className="support-page-intro program-page-intro section-wrap">
        <Eyebrow>DENTAL PATHWAY PROGRAM <span className="eyebrow-rule"/> MODULE {module.number}</Eyebrow>
        <h1>{module.title}</h1>
        <p>{module.summary}</p>
        <Link to={paths.modulesSection} className="breadcrumb-link">← All modules</Link>
      </section>
      <section className="module-page pathway-section">
        <div className="section-wrap pathway-wrap">
          <ModuleTabs/>
          <CurriculumSection module={module}/>
          <ModulePagination previous={modules[index - 1]} next={modules[index + 1]} pathFor={modulePath}/>
        </div>
      </section>
    </>
  );
}

export default function ModulePage() {
  const { slug } = useParams();
  const index = modules.findIndex(module => module.slug === slug);
  if (index === -1) return <NotFoundPage/>;
  return <ModuleContent index={index}/>;
}
