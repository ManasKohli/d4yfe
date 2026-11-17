import Eyebrow from '@/shared/ui/Eyebrow';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  eyebrow?: string;
  title?: ReactNode;
  /** A quieter second line under the title, in sage. */
  titleMuted?: ReactNode;
  lede?: ReactNode;
  /** `stack` puts the lede under the heading; `split` sets it beside the heading from 900px. */
  layout?: 'stack' | 'split';
  /** Inner width: `page` (default) or `narrow` for reading text. */
  width?: 'page' | 'narrow';
}

/** One page section: optional heading block, then content. Sections own vertical rhythm so pages never set margins. */
export default function Section({
  eyebrow, title, titleMuted, lede, layout = 'stack', width = 'page', className, children, ...rest
}: SectionProps) {
  const split = layout === 'split';
  return (
    <section className={cn('scroll-mt-24 py-16 md:py-24', className)} {...rest}>
      <div className={cn('container-page', width === 'narrow' && 'max-w-3xl')}>
        {(eyebrow || title) && (
          <header className={cn('mb-10 md:mb-14', split ? 'grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16' : 'max-w-2xl')}>
            <div>
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              {title && (
                <h2 className="text-3xl leading-[1.1] tracking-[-0.03em] md:text-5xl">
                  {title}
                  {titleMuted && <><br/><span className="text-sage">{titleMuted}</span></>}
                </h2>
              )}
            </div>
            {lede && <p className={cn('text-lg text-muted', !split && 'mt-4', split && 'lg:pb-1')}>{lede}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
