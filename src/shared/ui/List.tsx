import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '@/shared/lib/cn';

/** A hairline-divided list. Pair with ListRow. */
export function List({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={cn('divide-y divide-line', className)}>{children}</ul>;
}

interface ListRowProps {
  title: ReactNode;
  meta?: ReactNode;
  /** Right-hand content: a badge, button or small text. */
  trailing?: ReactNode;
  /** Makes the whole row a link. */
  to?: string;
  /** Makes the whole row a button, for master/detail lists. */
  onSelect?: () => void;
  selected?: boolean;
}

/** One row: title and meta on the left, trailing content on the right. 44px minimum target when interactive. */
export function ListRow({ title, meta, trailing, to, onSelect, selected }: ListRowProps) {
  const body = (
    <>
      <span className="min-w-0">
        <span className="block font-medium text-ink">{title}</span>
        {meta && <span className="block text-sm text-muted">{meta}</span>}
      </span>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </>
  );
  const rowClass = 'flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left';
  const interactive = cn(rowClass, '-mx-3 w-[calc(100%+1.5rem)] rounded-field px-3 no-underline transition-colors hover:bg-surface', selected && 'bg-green-soft hover:bg-green-soft');

  if (to) return <li><Link to={to} aria-current={selected ? 'page' : undefined} className={interactive}>{body}</Link></li>;
  if (onSelect) return <li><button type="button" aria-current={selected ? 'true' : undefined} onClick={onSelect} className={interactive}>{body}</button></li>;
  return <li className={rowClass}>{body}</li>;
}
