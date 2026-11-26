import { useEffect, useRef } from 'react';
import { buildShape, dentalMirror, molar, toothbrush, toothpaste } from './dental3d';

/**
 * Dotted 3D dental objects floating in the hero's side gutters: a molar, a toothbrush, a dental
 * mirror and a toothpaste tube. They turn slowly, lean toward the pointer, and whirl when the
 * pointer passes over them or they are clicked. Decorative and hidden from assistive tech; the
 * canvas never takes pointer events, so the headline and buttons stay fully usable. Under
 * prefers-reduced-motion they are drawn once and hold still.
 */

interface Placement {
  /** Centre, as a share of the hero's width and height. */
  x: number;
  y: number;
  /** Radius as a share of the hero's width, capped in pixels. */
  size: number;
  max: number;
  /** Resting orientation, in radians. */
  yaw: number;
  pitch: number;
  roll: number;
}

interface Item {
  dots: Float32Array;
  wide: Placement;
  /** Under 900px the objects shrink and flank the line above the school logos, clear of the
   * stacked headline and buttons. Here `y` is pixels below the top of the `data-hero-anchor` element. */
  narrow: Placement | null;
  /** Idle turning speed, radians per second. */
  turn: number;
  phase: number;
}

const SPACING = 0.075;
const WIDE = 900;

function buildItems(): Item[] {
  return [
    {
      dots: buildShape(molar, SPACING),
      wide: { x: 0.12, y: 0.36, size: 0.085, max: 125, yaw: 0.5, pitch: 0.35, roll: -0.15 },
      narrow: { x: 0.1, y: 22, size: 0.09, max: 32, yaw: 0.5, pitch: 0.35, roll: -0.15 },
      turn: 0.32, phase: 0,
    },
    {
      dots: buildShape(toothbrush, SPACING * 0.75),
      wide: { x: 0.87, y: 0.3, size: 0.1, max: 150, yaw: 0.4, pitch: 0.2, roll: 0.55 },
      narrow: { x: 0.9, y: 20, size: 0.11, max: 38, yaw: 0.4, pitch: 0.2, roll: 0.55 },
      turn: -0.24, phase: 1.7,
    },
    {
      dots: buildShape(dentalMirror, SPACING * 0.7),
      wide: { x: 0.17, y: 0.66, size: 0.075, max: 110, yaw: -0.3, pitch: 0.5, roll: -0.7 },
      narrow: null,
      turn: 0.2, phase: 3.1,
    },
    {
      dots: buildShape(toothpaste, SPACING * 0.8),
      wide: { x: 0.84, y: 0.64, size: 0.075, max: 110, yaw: 0.9, pitch: -0.3, roll: -0.35 },
      narrow: null,
      turn: -0.28, phase: 4.4,
    },
  ];
}

/** Colors come from the @theme tokens, like the rest of the hero. */
function readColors(el: HTMLElement) {
  const css = getComputedStyle(el);
  return { body: css.getPropertyValue('--color-blue').trim(), accent: css.getPropertyValue('--color-coral').trim() };
}

const isInteractive = (target: EventTarget | null) =>
  target instanceof Element && target.closest('a, button, input, select, textarea, [role="button"]') !== null;

export default function HeroDental() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    const hero = cv?.closest('section');
    if (!cv || !ctx || !hero) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const colors = readColors(cv);
    const items = buildItems().map(item => ({ ...item, spin: 0, extraYaw: 0, hovered: false, cx: 0, cy: 0, r: 0 }));
    const pointer = { x: 0, y: 0, sx: 0, sy: 0, inside: false };
    const anchor = hero.querySelector<HTMLElement>('[data-hero-anchor]');
    let width = 0, height = 0, dpr = 1, raf = 0, visible = true, last = 0;
    const t0 = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = cv.clientWidth;
      height = cv.clientHeight;
      cv.width = Math.round(width * dpr);
      cv.height = Math.round(height * dpr);
    };

    const draw = (now: number) => {
      const t = reduced ? 0 : (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const wide = width >= WIDE;
      // Read each frame: web fonts and the hero's entrance can move the anchor after mount.
      // The canvas fills the hero, so the anchor's offset in the hero is its offset on the canvas.
      const anchorTop = anchor?.offsetTop ?? height * 0.85;
      for (const item of items) {
        const place = wide ? item.wide : item.narrow;
        if (!place) { item.r = 0; continue; }
        const r = Math.min(width * place.size, place.max);
        // Float gently, and drift a few pixels with the pointer for depth.
        const cx = width * place.x + pointer.sx * r * 0.12;
        const cy = (wide ? height * place.y : anchorTop + place.y) + Math.sin(t * 0.9 + item.phase) * r * 0.08 + pointer.sy * r * 0.08;
        Object.assign(item, { cx, cy, r });

        const yaw = place.yaw + t * item.turn + item.extraYaw + pointer.sx * 0.45;
        const pitch = place.pitch + Math.sin(t * 0.6 + item.phase) * 0.12 + pointer.sy * 0.3;
        const roll = place.roll;
        const [cY, sY, cP, sP, cR, sR] = [Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch), Math.cos(roll), Math.sin(roll)];

        const size = Math.max(1.1, Math.min(r / 70, 1.8));
        const bands = [[new Path2D(), new Path2D(), new Path2D()], [new Path2D(), new Path2D(), new Path2D()]] as const;
        const d = item.dots;
        for (let i = 0; i < d.length; i += 4) {
          // Roll about z, turn about y, then tip about x.
          const x0 = d[i]! * cR - d[i + 1]! * sR, y0 = d[i]! * sR + d[i + 1]! * cR, z0 = d[i + 2]!;
          const x1 = x0 * cY + z0 * sY, z1 = -x0 * sY + z0 * cY;
          const y2 = y0 * cP - z1 * sP, z2 = y0 * sP + z1 * cP;
          const depth = (z2 + 1) / 2; // 0 at the back, 1 at the front
          const persp = 1 + z2 * 0.12;
          bands[d[i + 3]! > 0 ? 1 : 0][Math.min(2, Math.floor(depth * 3))]!.rect(cx + x1 * r * persp - size / 2, cy - y2 * r * persp - size / 2, size, size);
        }
        bands.forEach((set, accent) => {
          ctx.fillStyle = accent ? colors.accent : colors.body;
          set.forEach((band, i) => {
            ctx.globalAlpha = (accent ? 0.35 : 0.16) + i * (accent ? 0.25 : 0.2);
            ctx.fill(band);
          });
        });
      }
      ctx.globalAlpha = 1;
    };

    const kick = (item: (typeof items)[number]) => { item.spin = Math.min(item.spin + 9, 14); };

    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const ease = 1 - Math.pow(0.04, dt);
      pointer.sx += ((pointer.inside ? pointer.x : 0) - pointer.sx) * ease;
      pointer.sy += ((pointer.inside ? pointer.y : 0) - pointer.sy) * ease;
      for (const item of items) {
        item.extraYaw += item.spin * dt;
        item.spin *= Math.pow(0.08, dt);
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    const play = () => {
      if (reduced) return draw(performance.now());
      if (!raf && visible) { last = 0; raf = requestAnimationFrame(tick); }
    };

    const hit = (e: PointerEvent) => {
      const box = cv.getBoundingClientRect();
      const x = e.clientX - box.left, y = e.clientY - box.top;
      return items.find(item => item.r > 0 && Math.hypot(x - item.cx, y - item.cy) < item.r * 0.9);
    };

    const onMove = (e: PointerEvent) => {
      const box = hero.getBoundingClientRect();
      pointer.x = ((e.clientX - box.left) / box.width) * 2 - 1;
      pointer.y = ((e.clientY - box.top) / box.height) * 2 - 1;
      pointer.inside = true;
      const over = hit(e);
      for (const item of items) {
        const now = item === over;
        if (now && !item.hovered) kick(item); // whirl once as the pointer arrives
        item.hovered = now;
      }
    };
    const onLeave = () => {
      pointer.inside = false;
      for (const item of items) item.hovered = false;
    };
    const onDown = (e: PointerEvent) => {
      if (isInteractive(e.target)) return;
      const item = hit(e);
      if (item) kick(item);
    };

    if (!reduced) {
      hero.addEventListener('pointermove', onMove);
      hero.addEventListener('pointerleave', onLeave);
      hero.addEventListener('pointerdown', onDown);
    }
    const resizer = new ResizeObserver(() => { resize(); draw(performance.now()); });
    resizer.observe(cv);
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) play();
    });
    viewport.observe(cv);
    const onVisibility = () => { if (!document.hidden) play(); };
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    play();

    return () => {
      visible = false;
      cancelAnimationFrame(raf);
      resizer.disconnect();
      viewport.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      hero.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full"/>;
}
