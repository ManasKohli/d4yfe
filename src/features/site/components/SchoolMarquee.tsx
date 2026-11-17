import { useState } from 'react';
import { hero, schools } from '@/data/program';
import { cn } from '@/shared/lib/cn';
import Icon from '@/shared/ui/Icon';

/** One run of logos. Only the first run is exposed to assistive tech; the repeats exist for the loop. */
function SchoolList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cn('flex shrink-0 items-center gap-14 pr-14 md:gap-20 md:pr-20', hidden && 'motion-reduce:hidden')}
    >
      {schools.map(school => (
        <li key={school.name} className="shrink-0">
          <img
            src={school.logo}
            alt={hidden ? '' : school.name}
            className={cn('w-auto select-none', school.shape === 'crest' ? 'h-12 md:h-14' : 'h-8 md:h-10')}
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * A slow, continuous row of dental school logos. The track holds four runs and moves by half its width,
 * so the loop is seamless even on screens wider than one run. A pause button stops it (WCAG 2.2.2),
 * and with reduced motion it is a single static, wrapped list.
 */
export default function SchoolMarquee() {
  const [paused, setPaused] = useState(false);
  return (
    <div>
      <div className="container-page mb-6 flex items-center justify-center gap-2">
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
            'motion-reduce:w-full motion-reduce:animate-none motion-reduce:[&>ul]:w-full motion-reduce:[&>ul]:shrink motion-reduce:[&>ul]:flex-wrap motion-reduce:[&>ul]:justify-center motion-reduce:[&>ul]:gap-y-6 motion-reduce:[&>ul]:pr-0',
          )}
        >
          <SchoolList/>
          <SchoolList hidden/>
          <SchoolList hidden/>
          <SchoolList hidden/>
        </div>
      </div>
    </div>
  );
}
