import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface GreenPanelProps extends Omit<ComponentProps<'section'>, 'title'> {
  title: string;
  lede?: ReactNode;
}

/** A rounded brand-green band: the one emphasized block on a public page. Focus rings switch to white on green. */
export default function GreenPanel({ title, lede, className, children, ...rest }: GreenPanelProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn('scroll-mt-24 rounded-panel bg-green p-6 text-white md:p-10 lg:p-12 [&_:focus-visible]:outline-white', className)}
      {...rest}
    >
      <h2 id={headingId} className="max-w-2xl text-3xl md:text-4xl">{title}</h2>
      {lede && <p className="mt-4 max-w-2xl text-lg text-on-brand-muted">{lede}</p>}
      {children}
    </section>
  );
}

/** Pill chips for short items inside a green panel. */
export function PanelChips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(item => <li key={item} className="rounded-full bg-brand-raised px-4 py-2 text-ui">{item}</li>)}
    </ul>
  );
}
