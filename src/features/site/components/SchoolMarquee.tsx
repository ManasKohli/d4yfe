import { useState } from 'react';
import { hero, schools } from '@/data/program';
import { cn } from '@/shared/lib/cn';
import Icon from '@/shared/ui/Icon';

function SchoolList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cn('flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16', hidden && 'motion-reduce:hidden')}
    >
      {schools.map(school => (
        <li key={school} className="font-display text-lg font-bold tracking-[-0.01em] whitespace-nowrap text-sage md:text-xl">
          {school}
        </li>
      ))}
    </ul>
  );
}

/**
 * A slow, continuous row of dental school names. The list renders twice so the loop is seamless; the copy
 * is hidden from screen readers. A pause button stops it (WCAG 2.2.2), and with reduced motion it is a
 * static, wrapped list.
 */
export default function SchoolMarquee() {
  const [paused, setPaused] = useState(false);
  return (
    <div>
      <div className="container-page mb-5 flex items-center justify-center gap-2">
        <p className="text-center text-sm text-balance text-subtle">{hero.schoolsCaption}</p>
        <button
          type="button"
          onClick={() => setPaused(value => !value)}
          aria-label={paused ? 'Play school list' : 'Pause school list'}
          className="inline-grid size-11 place-items-center rounded-full text-subtle transition-colors hover:bg-tint hover:text-ink motion-reduce:hidden"
        >
          <Icon name={paused ? 'play' : 'pause'} size={14}/>
        </button>
      </div>
      <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] motion-reduce:container-page motion-reduce:[mask-image:none]">
        <div
          className={cn(
            'flex w-max animate-marquee group-hover:[animation-play-state:paused]',
            paused && '[animation-play-state:paused]',
            'motion-reduce:w-full motion-reduce:animate-none motion-reduce:[&>ul]:flex-wrap motion-reduce:[&>ul]:justify-center motion-reduce:[&>ul]:gap-y-3 motion-reduce:[&>ul]:pr-0 motion-reduce:[&>ul]:w-full motion-reduce:[&>ul]:shrink',
          )}
        >
          <SchoolList/>
          <SchoolList hidden/>
        </div>
      </div>
    </div>
  );
}
