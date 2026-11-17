import { NavLink, useParams } from 'react-router';
import { modulePath, paths } from '@/app/paths';
import { modules } from '@/data/modules';
import CurriculumSection from '@/features/site/components/CurriculumSection';
import ModulePagination from '@/shared/components/ModulePagination';
import NotFoundPage from '@/shared/components/NotFoundPage';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { cn } from '@/shared/lib/cn';
import { ButtonLink } from '@/shared/ui/Button';
import PageHeader from '@/shared/ui/PageHeader';
import TagList from '@/shared/ui/TagList';
import type { ProgramModule } from '@/types';

/** Module switcher: scrolls sideways on small screens, current module kept visible. */
function ModuleTabs() {
  return (
    <nav aria-label="Modules" className="-mx-4 mb-10 overflow-x-auto px-4 md:mx-0 md:px-0">
      <ul className="flex w-max gap-2 md:w-auto md:flex-wrap">
        {modules.map(module => (
          <li key={module.slug}>
            <NavLink
              to={modulePath(module.slug)}
              className={({ isActive }) => cn(
                'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-ui whitespace-nowrap no-underline',
                isActive ? 'border-green bg-green text-white' : 'border-line bg-card text-ink hover:border-line-strong',
              )}
            >
              <span className="font-display text-sm font-bold opacity-70">{module.number}</span>
              {module.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ModuleContent({ module, index }: { module: ProgramModule; index: number }) {
  useDocumentTitle(`Module ${module.number}: ${module.title}`);
  return (
    <div className="container-page pt-12 pb-16 md:pt-16">
      <ModuleTabs/>
      <PageHeader eyebrow={`Module ${module.number} · ${module.tag}`} title={module.title} lede={module.summary}>
        <ButtonLink to={paths.packages} variant="outline">Packages</ButtonLink>
      </PageHeader>
      <TagList tags={module.tags}/>
      <CurriculumSection module={module}/>
      <ModulePagination previous={modules[index - 1]} next={modules[index + 1]} pathFor={modulePath}/>
    </div>
  );
}

export default function ModulePage() {
  const { slug } = useParams();
  const index = modules.findIndex(module => module.slug === slug);
  const module = modules[index];
  if (!module) return <NotFoundPage/>;
  return <ModuleContent key={module.slug} module={module} index={index}/>;
}
