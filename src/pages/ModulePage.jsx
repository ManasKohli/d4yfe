import { Link, NavLink, useParams } from 'react-router';
import CurriculumSection from '../components/CurriculumSection.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import { modules } from '../data/modules.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { modulePath, paths } from '../routes.js';
import NotFoundPage from './NotFoundPage.jsx';

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

function ModulePagination({ previous, next }) {
  return (
    <nav className="module-pagination" aria-label="Previous and next module">
      {previous ? <Link to={modulePath(previous.slug)}><span>PREVIOUS MODULE</span><strong>← {previous.title}</strong></Link> : <span/>}
      {next && <Link className="next-module" to={modulePath(next.slug)}><span>NEXT MODULE</span><strong>{next.title} →</strong></Link>}
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
          <ModulePagination previous={modules[index - 1]} next={modules[index + 1]}/>
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
