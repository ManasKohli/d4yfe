import Eyebrow from '@/shared/ui/Eyebrow';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  /** Inner width: `page` (default) or `narrow` for reading text. */
  width?: 'page' | 'narrow';
  /** Heading alignment: `start` (default) or `center`. */
  align?: 'start' | 'center';
}

/** One page section: optional heading block, then content. Sections own vertical rhythm so pages never set margins. */
export default function Section({
  eyebrow, title, lede, width = 'page', align = 'start', className, children, ...rest
}: SectionProps) {
  const headingId = useId();
  const labelledBy = title && !rest['aria-labelledby'] && !rest['aria-label'] ? headingId : undefined;

  return (
    <section className={cn('scroll-mt-24 py-12 md:py-16', className)} aria-labelledby={labelledBy} {...rest}>
      <div className={cn('container-page', width === 'narrow' && 'max-w-3xl')}>
        {(eyebrow || title) && (
          <header className={cn('mb-8 max-w-2xl md:mb-10', align === 'center' && 'mx-auto text-center')}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <h2 id={headingId} className="text-3xl md:text-4xl">{title}</h2>}
            {lede && <p className="mt-4 text-lg text-muted">{lede}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
