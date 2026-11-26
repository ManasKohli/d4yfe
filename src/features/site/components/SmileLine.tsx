import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';
import Icon from '@/shared/ui/Icon';
import { liftFor } from './motion';
import { sparkleBurst } from './sparkleBurst';

/** Space each tooth takes, in pixels. */
const PITCH = 34;

/**
 * A row of small tooth outlines along the top of the footer. Teeth near the pointer lift and turn
 * navy, a wave runs along the row the first time it scrolls into view, and clicking a tooth throws a
 * small burst of sparkles. Listens to the pointer anywhere in the surrounding footer.
 * Decorative and hidden from assistive tech; still under prefers-reduced-motion.
 */
export default function SmileLine() {
  const row = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [waved, setWaved] = useState(false);

  // As many teeth as fit, recounted when the width changes.
  useEffect(() => {
    const el = row.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const resizer = new ResizeObserver(() => setCount(Math.max(0, Math.floor(el.clientWidth / PITCH))));
    resizer.observe(el);
    return () => resizer.disconnect();
  }, []);

  useEffect(() => {
    const el = row.current;
    const host = el?.closest('footer') ?? el?.parentElement;
    if (!el || !host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const watcher = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setWaved(true); watcher.disconnect(); }
    }, { threshold: 0.5 });
    watcher.observe(el);

    let raf = 0, pointerX: number | null = null;
    const place = () => {
      raf = 0;
      for (const tooth of el.children) {
        if (!(tooth instanceof HTMLElement)) continue;
        const box = tooth.getBoundingClientRect();
        const lift = pointerX === null ? 0 : liftFor(pointerX - (box.left + box.width / 2));
        tooth.style.transform = `translateY(${-lift * 10}px) rotate(${lift * (pointerX! < box.left ? 8 : -8)}deg)`;
        tooth.classList.toggle('text-blue', lift > 0.35);
      }
    };
    const onMove = (e: PointerEvent) => { pointerX = e.clientX; if (!raf) raf = requestAnimationFrame(place); };
    const onLeave = () => { pointerX = null; if (!raf) raf = requestAnimationFrame(place); };
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    return () => {
      watcher.disconnect();
      cancelAnimationFrame(raf);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={row} aria-hidden className="flex h-8 justify-between overflow-hidden px-1 pt-2">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          onClick={e => sparkleBurst(e.clientX, e.clientY, 14)}
          style={{ animationDelay: `${i * 35}ms` }}
          className={cn(
            'flex size-5 shrink-0 text-line-strong transition-[transform,color] duration-300 ease-out-soft',
            waved && 'animate-wave',
          )}
        >
          <Icon name="tooth" size={20}/>
        </span>
      ))}
    </div>
  );
}
