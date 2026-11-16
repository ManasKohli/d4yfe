import { Link } from 'react-router';
import type { ProgramModule } from '@/types';

interface ModulePaginationProps {
  previous?: ProgramModule;
  next?: ProgramModule;
  /** Where a module link goes: the public module page or the portal module page. */
  pathFor: (slug: string) => string;
}

const linkClass = 'flex min-h-16 flex-col justify-center rounded-card border border-line bg-card px-5 py-3 no-underline transition-colors hover:border-line-strong';

export default function ModulePagination({ previous, next, pathFor }: ModulePaginationProps) {
  return (
    <nav className="mt-12 grid gap-3 md:grid-cols-2" aria-label="Previous and next module">
      {previous ? (
        <Link to={pathFor(previous.slug)} className={linkClass}>
          <span className="text-sm text-muted">Previous module</span>
          <strong className="font-display text-ink">{previous.title}</strong>
        </Link>
      ) : <span className="hidden md:block"/>}
      {next && (
        <Link to={pathFor(next.slug)} className={`${linkClass} md:text-right`}>
          <span className="text-sm text-muted">Next module</span>
          <strong className="font-display text-ink">{next.title}</strong>
        </Link>
      )}
    </nav>
  );
}
