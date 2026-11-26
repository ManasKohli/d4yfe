import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';
import { sweepProgress } from './motion';

/** The bristles' centre, in the 132-wide SVG below; the brush is placed so they lead. */
const BRISTLES_X = 114;
const FOAM = [0, 1, 2, 3, 4];

/**
 * A toothbrush that scrubs along the top rule of the "how it works" steps as the page scrolls,
 * filling each step's rule in blue as it passes and leaving a little foam. Place it as the first
 * child of a `relative` wrapper around a row of `columns` equal grid columns with `gap-8`.
 * Decorative and hidden from assistive tech; shown from 680px, where the steps sit in one row.
 * Under prefers-reduced-motion it rests at the end with every rule filled.
 */
export default function BrushSweep({ columns }: { columns: number }) {
  const host = useRef<HTMLDivElement>(null);
  const brush = useRef<HTMLDivElement>(null);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const [scrubbing, setScrubbing] = useState(false);

  useEffect(() => {
    const el = host.current, brushEl = brush.current;
    if (!el || !brushEl) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, stopTimer = 0, last = -1;

    const place = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const p = reduced ? 1 : sweepProgress(box.top, window.innerHeight);
      const x = p * box.width;
      brushEl.style.transform = `translateX(${x - BRISTLES_X}px)`;
      fills.current.forEach(fill => {
        const cell = fill?.parentElement;
        if (!fill || !cell) return;
        const filled = Math.max(0, Math.min(cell.offsetWidth, x - cell.offsetLeft));
        fill.style.transform = `scaleX(${cell.offsetWidth ? filled / cell.offsetWidth : 0})`;
      });
      if (!reduced && last >= 0 && p !== last && p > 0 && p < 1) {
        setScrubbing(true);
        window.clearTimeout(stopTimer);
        stopTimer = window.setTimeout(() => setScrubbing(false), 180);
      }
      last = p;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(place); };

    place();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(stopTimer);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div ref={host} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden md:block">
      <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }, (_, i) => (
          <span key={i} className="relative block h-0.5">
            <span ref={node => { fills.current[i] = node; }} className="absolute inset-0 origin-left bg-blue" style={{ transform: 'scaleX(0)' }}/>
          </span>
        ))}
      </div>
      <div ref={brush} className="absolute -top-[38px] left-0 will-change-transform">
        <svg width="132" height="40" viewBox="0 0 132 40" className={cn('overflow-visible', scrubbing && 'animate-scrub')}>
          <rect x="4" y="21" width="92" height="9" rx="4.5" className="fill-blue"/>
          <path d="M92 22.5 L106 20 L106 25 L92 28.5 Z" className="fill-blue"/>
          <rect x="102" y="18" width="26" height="7" rx="3" className="fill-blue"/>
          <g className="stroke-coral" strokeWidth="2" strokeLinecap="round">
            {Array.from({ length: 8 }, (_, i) => <line key={i} x1={104.5 + i * 3} y1="26" x2={104.5 + i * 3} y2="37"/>)}
          </g>
          <g className={cn('fill-blue-soft stroke-steel/40 transition-opacity duration-300', scrubbing ? 'opacity-100' : 'opacity-0')} strokeWidth="0.8">
            {FOAM.map(i => (
              <circle key={i} cx={98 - i * 7} cy={34 - (i % 2) * 4} r={2.4 + (i % 3)} className="origin-center animate-foam [transform-box:fill-box]" style={{ animationDelay: `${-i * 0.18}s` }}/>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
