import Eyebrow from '@/shared/ui/Eyebrow';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  /** Inner width: `page` (default) or `narrow` for reading text. */
  width?: 'page' | 'narrow';
}

/** One page section: optional heading block, then content. Sections own vertical rhythm so pages never set margins. */
export default function Section({ eyebrow, title, lede, width = 'page', className, children, ...rest }: SectionProps) {
  return (
    <section className={cn('scroll-mt-24 py-16 md:py-20', className)} {...rest}>
      <div className={cn('container-page', width === 'narrow' && 'max-w-3xl')}>
        {(eyebrow || title) && (
          <header className="mb-10 max-w-2xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <h2 className="text-3xl md:text-4xl">{title}</h2>
            )}
            {lede && <p className="mt-4 text-lg text-muted">{lede}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
