import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface CardProps extends Omit<ComponentProps<'section'>, 'title'> {
  title?: ReactNode;
  /** Small uppercase label above the title. */
  label?: string;
  /** Renders at the right of the heading, e.g. a link. */
  action?: ReactNode;
  headingLevel?: 2 | 3;
}

/** A titled panel. Use it when the box itself groups something; plain content doesn't need a card. */
export default function Card({ title, label, action, headingLevel = 2, className, children, ...rest }: CardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <section className={cn('min-w-0 rounded-card border border-line bg-card p-5 md:p-6', className)} {...rest}>
      {(title || label || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {label && <p className="mb-1 text-xs font-semibold tracking-wider text-accent uppercase">{label}</p>}
            {title && <Heading className="text-lg">{title}</Heading>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
