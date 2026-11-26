import type { PointerEvent } from 'react';

/** Small motion helpers for the landing page: the card tilt, the toothbrush sweep and the footer's tooth lift. */

/** Where the brush is, from 0 to 1, given the steps' top edge on screen. It starts when the row is
 * 85% of the way down the viewport and finishes when it reaches 40%. */
export function sweepProgress(top: number, viewport: number) {
  return Math.max(0, Math.min(1, (viewport * 0.85 - top) / (viewport * 0.45)));
}

/** The most a card leans, in degrees. Small, so text stays easy to read. */
const MAX_TILT = 6;

/** The lean for a pointer at (x, y) inside a box of the given size: the near edge dips toward it. */
export function tiltFor(x: number, y: number, width: number, height: number) {
  const nx = Math.max(-1, Math.min(1, (x / width) * 2 - 1));
  const ny = Math.max(-1, Math.min(1, (y / height) * 2 - 1));
  return { rotateX: -ny * MAX_TILT, rotateY: nx * MAX_TILT };
}

/** How much a footer tooth lifts (0 to 1) for a pointer `distance` pixels away: a smooth bump that
 * fades to nothing at `reach`. */
export function liftFor(distance: number, reach = 120) {
  const k = Math.max(0, 1 - Math.abs(distance) / reach);
  return k * k * (3 - 2 * k);
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Pointer handlers that lean an element toward the pointer in 3D, and level it on leave.
 * Spread them on any element with the `tilt-card` utility. Mouse and pen only; skipped under reduced motion.
 */
export const tiltHandlers = {
  onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType === 'touch' || reducedMotion()) return;
    const el = e.currentTarget;
    const box = el.getBoundingClientRect();
    const { rotateX, rotateY } = tiltFor(e.clientX - box.left, e.clientY - box.top, box.width, box.height);
    el.style.setProperty('--tilt-x', `${rotateX}deg`);
    el.style.setProperty('--tilt-y', `${rotateY}deg`);
  },
  onPointerLeave(e: PointerEvent<HTMLElement>) {
    e.currentTarget.style.setProperty('--tilt-x', '0deg');
    e.currentTarget.style.setProperty('--tilt-y', '0deg');
  },
};
