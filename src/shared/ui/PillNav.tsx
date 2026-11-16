import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import { cn } from '@/shared/lib/cn';
import Icon from '@/shared/ui/Icon';

export interface PillNavLink { label: string; to: string; end?: boolean }

interface PillNavProps {
  label: string;
  brand: ReactNode;
  links: PillNavLink[];
  /** Right-hand actions, e.g. Sign in. Also listed in the phone menu. */
  actions: ReactNode;
}

const linkClass = (isActive: boolean) =>
  cn('inline-flex min-h-11 items-center rounded-full px-3 text-ui no-underline transition-colors hover:text-ink', isActive ? 'text-ink' : 'text-muted');

/** Section links (with a #hash) never show as active: the router ignores the hash, so they would all match. */
function NavItem({ link, className, onClick }: { link: PillNavLink; className: (isActive: boolean) => string; onClick?: () => void }) {
  if (link.to.includes('#')) return <Link to={link.to} onClick={onClick} className={className(false)}>{link.label}</Link>;
  return <NavLink to={link.to} end={link.end} onClick={onClick} className={({ isActive }) => className(isActive)}>{link.label}</NavLink>;
}

/**
 * Floating pill navigation. From 900px the links sit inline; below that a Menu button opens a panel
 * with 48px rows. Esc or the button closes it, and focus returns to the button (design review D3).
 */
export default function PillNav({ label, brand, links, actions }: PillNavProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-3 z-40 px-4 pt-3 md:px-6">
      <div className="mx-auto max-w-6xl rounded-full border border-line bg-card/90 shadow-soft backdrop-blur-md">
        <div className="flex min-h-14 items-center justify-between gap-4 py-1.5 pr-2 pl-5">
          {brand}
          <nav aria-label={label} className="hidden items-center gap-1 lg:flex">
            {links.map(link => <NavItem key={link.label} link={link} className={linkClass}/>)}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">{actions}</div>
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-ui lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => (open ? close() : setOpen(true))}
          >
            <Icon name={open ? 'close' : 'menu'} size={18}/>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
      {open && (
        <div ref={panelRef} id={panelId} className="mx-auto mt-2 max-w-6xl rounded-table border border-line bg-card p-2 shadow-lift lg:hidden">
          <nav aria-label={label} className="flex flex-col">
            {links.map(link => (
              <NavItem
                key={link.label}
                link={link}
                onClick={() => close(false)}
                className={() => 'flex min-h-12 items-center rounded-field px-4 text-base text-ink no-underline hover:bg-tint'}
              />
            ))}
          </nav>
          <div className="mt-2 flex flex-col gap-2 border-t border-line px-2 pt-3 pb-1" onClick={() => close(false)}>{actions}</div>
        </div>
      )}
    </header>
  );
}
