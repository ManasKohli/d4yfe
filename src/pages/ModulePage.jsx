import { Link, NavLink, useParams } from 'react-router';
import CurriculumSection from '../components/CurriculumSection.jsx';
import { curriculum } from '../data/curriculum.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { modulePath, paths } from '../routes.js';
import NotFoundPage from './NotFoundPage.jsx';

function ModuleTabs() {
  return (
    <div className="page-module-nav">
      {curriculum.map(module => (
        <NavLink key={module.number} className={({ isActive }) => isActive ? 'page-module-link active' : 'page-module-link'} to={modulePath(module.number)}>
          <span>MODULE {module.number}</span><strong>{module.title}</strong>
        </NavLink>
      ))}
    </div>
  );
}

function ModulePagination({ previous, next }) {
  return (
    <div className="module-pagination">
      {previous ? <Link to={modulePath(previous.number)}><span>PREVIOUS MODULE</span><strong>← {previous.title}</strong></Link> : <span/>}
      {next && <Link className="next-module" to={modulePath(next.number)}><span>NEXT MODULE</span><strong>{next.title} →</strong></Link>}
    </div>
  );
}

function ModuleContent({ index }) {
  const module = curriculum[index];
  useDocumentTitle(`Module ${module.number}: ${module.title}`);
  return (
    <section className="module-page pathway-section">
      <div className="section-wrap pathway-wrap">
        <Link to={paths.modulesSection} className="breadcrumb-link">← All learning modules</Link>
        <ModuleTabs/>
        <CurriculumSection module={module}/>
        <ModulePagination previous={curriculum[index - 1]} next={curriculum[index + 1]}/>
      </div>
    </section>
  );
}

export default function ModulePage() {
  const { moduleNumber } = useParams();
  const index = curriculum.findIndex(module => module.number === moduleNumber);
  if (index === -1) return <NotFoundPage/>;
  return <ModuleContent index={index}/>;
}
