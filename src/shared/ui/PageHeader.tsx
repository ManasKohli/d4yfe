import Eyebrow from '@/shared/ui/Eyebrow';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
  /** `default` (portal pages, unchanged) or `display` for public inner pages. */
  size?: 'default' | 'display';
}

/** The page's single h1, with an optional eyebrow, lede and actions. */
export default function PageHeader({ eyebrow, title, lede, children, size = 'default' }: PageHeaderProps) {
  const display = size === 'display';
  return (
    <header className={cn('max-w-3xl', display ? 'mb-0' : 'mb-8')}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className={display ? 'text-4xl leading-[1.05] md:text-5xl lg:text-6xl' : 'text-3xl md:text-4xl'}>{title}</h1>
      {lede && (display
        ? <div className="mt-5 max-w-2xl text-lg text-muted md:text-xl">{lede}</div>
        : <p className="mt-3 text-lg text-muted">{lede}</p>)}
      {children && <div className="mt-5 flex flex-wrap gap-3">{children}</div>}
    </header>
  );
}
