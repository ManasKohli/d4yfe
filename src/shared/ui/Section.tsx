import Eyebrow from '@/shared/ui/Eyebrow';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  /** Inner width: `page` (default) or `narrow` for reading text. */
  width?: 'page' | 'narrow';
  /** `stacked` (default, unchanged) or `split`: heading left, content right from 900px. */
  layout?: 'stacked' | 'split';
  /** Hairline at the top of the content column, for consecutive sections on paper. */
  rule?: boolean;
  /** Id for the h2, when something else on the page (a table, a link) needs to reference the heading. */
  headingId?: string;
}

/** One page section: optional heading block, then content. Sections own vertical rhythm so pages never set margins. */
export default function Section({
  eyebrow, title, lede, width = 'page', layout = 'stacked', rule = false, headingId: headingIdProp, className, children, ...rest
}: SectionProps) {
  const autoId = useId();
  const headingId = headingIdProp ?? autoId;
  const split = layout === 'split';
  const labelledBy = title && !rest['aria-labelledby'] && !rest['aria-label'] ? headingId : undefined;

  const header = (eyebrow || title) && (
    <header className={cn('mb-10 max-w-2xl', split && 'lg:mb-0')}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && <h2 id={headingId} className="text-3xl md:text-4xl">{title}</h2>}
      {lede && <p className="mt-4 text-lg text-muted">{lede}</p>}
    </header>
  );
  const body = split || rule
    ? (
      <div className={cn(
        rule && 'border-t border-line pt-16 md:pt-20',
        split && 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16',
      )}>
        {header}
        {split ? <div className="min-w-0">{children}</div> : children}
      </div>
    )
    : <>{header}{children}</>;

  return (
    <section
      className={cn('scroll-mt-24', rule ? 'pb-16 md:pb-20' : 'py-16 md:py-20', className)}
      aria-labelledby={labelledBy}
      {...rest}
    >
      <div className={cn('container-page', width === 'narrow' && 'max-w-3xl')}>{body}</div>
    </section>
  );
}
