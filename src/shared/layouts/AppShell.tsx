import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { paths } from '@/app/paths';
import { demoNotice } from '@/data/demo';
import { areas } from '@/data/portal';
import Brand from '@/shared/components/Brand';
import { cn } from '@/shared/lib/cn';
import ScrollManager from '@/app/ScrollManager';
import SkipLink from '@/shared/ui/SkipLink';

interface AppShellProps {
  area: keyof typeof areas;
  basePath: string;
  /** Comes from the Supabase session once auth is connected. */
  user: { name: string; initials: string };
}

const navClass = ({ isActive }: { isActive: boolean }) => cn(
  'flex min-h-11 shrink-0 items-center rounded-full px-4 text-ui whitespace-nowrap no-underline transition-colors',
  isActive ? 'bg-green-soft font-medium text-green' : 'text-ink-2 hover:bg-tint',
);

/**
 * Layout for a signed-in area. From 900px: a sidebar with pill-highlighted items.
 * Below that: a top bar with a sideways-scrolling pill row that keeps the current item in view (design review D3).
 */
export default function AppShell({ area, basePath, user }: AppShellProps) {
  const { label, nav } = areas[area];
  const navRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    navRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [pathname]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <SkipLink/>
      {/* Runs again once this lazy area has rendered, so /portal/...#chapter-2 deep links land on their section. */}
      <ScrollManager/>
      <aside className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur-md lg:h-dvh lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 pt-3 lg:flex-col lg:items-start lg:px-5 lg:pt-6">
          <Brand aria-label="D4Y Dental Pathway, public site"/>
          <p className="text-sm font-semibold tracking-wider text-accent uppercase lg:mt-6 lg:px-4">{label}</p>
        </div>
        <nav ref={navRef} aria-label={label} className="overflow-x-auto px-4 py-2 lg:mt-2 lg:overflow-visible lg:px-5">
          <ul className="flex gap-1 lg:flex-col">
            {nav.map(item => (
              <li key={item.label}>
                <NavLink to={item.to ? `${basePath}/${item.to}` : basePath} end={item.end} className={navClass}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden border-t border-line px-5 py-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <div className="flex items-center gap-3">
            <span aria-hidden className="grid size-9 place-items-center rounded-full bg-tint text-sm font-semibold text-ink-2">{user.initials}</span>
            <div className="min-w-0">
              <p className="truncate font-medium">{user.name}</p>
              <Link to={paths.login} className="inline-flex min-h-11 items-center text-sm text-muted hover:text-ink">Sign out</Link>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <p className="border-b border-line bg-warn-soft px-4 py-2 text-sm text-warn md:px-8">{demoNotice}</p>
        <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-8 outline-none md:px-8 md:py-10">
          <Outlet/>
          <p className="mt-12 text-sm text-muted lg:hidden">
            Signed in as {user.name} · <Link to={paths.login} className="text-muted hover:text-ink">Sign out</Link>
          </p>
        </main>
      </div>
    </div>
  );
}
