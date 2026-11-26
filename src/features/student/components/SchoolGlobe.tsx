import { useEffect, useRef, useState } from 'react';
import { landDots, rotate, shortestTurn, toVec, type Vec3 } from './globe';

export interface GlobePin {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface SchoolGlobeProps {
  pins: GlobePin[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string;
}

const RAD = Math.PI / 180;
const TILT_LIMIT = 1.2;
/** How far a press may travel and still count as a click on a pin, in CSS pixels. */
const CLICK_SLOP = 5;
const HIT_RADIUS = 16;
/** How far the globe magnifies when a school is chosen, so neighbouring campuses separate. */
const FOCUS_ZOOM = 2.4;

/** Colors come from the @theme tokens so the globe follows the design system. */
function readColors(el: HTMLElement) {
  const css = getComputedStyle(el);
  const token = (name: string) => css.getPropertyValue(`--color-${name}`).trim();
  return { land: token('steel'), pin: token('blue'), rim: token('line-strong'), fill: token('card'), halo: token('card') };
}

/**
 * A dotted globe with one pin per school. Drag to turn it; select a pin to choose that school.
 * When `selectedId` changes, the globe turns to face it. It turns slowly on its own while nothing is
 * selected, and holds still for people who prefer reduced motion.
 */
export default function SchoolGlobe({ pins, selectedId, onSelect, label }: SchoolGlobeProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<{ pin: GlobePin; x: number; y: number } | null>(null);

  // Props the animation loop reads without restarting it.
  const latest = useRef({ pins, selectedId, onSelect });
  const aim = useRef<{ yaw: number; tilt: number } | null>(null);
  /** Restarts the loop, or redraws once under reduced motion, after the selection changes. */
  const redraw = useRef<(() => void) | null>(null);

  useEffect(() => {
    latest.current = { pins, selectedId, onSelect };
  }, [pins, selectedId, onSelect]);

  useEffect(() => {
    const pin = pins.find(p => p.id === selectedId);
    aim.current = pin ? { yaw: pin.lon * RAD, tilt: pin.lat * RAD } : null;
    redraw.current?.();
  }, [pins, selectedId]);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    const ctx = cv?.getContext('2d');
    if (!el || !cv || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const colors = readColors(el);
    const dots = landDots(el.clientWidth < 400 ? 14000 : 22000);
    const pinVecs = new Map<string, Vec3>();
    const vecOf = (p: GlobePin) => {
      let v = pinVecs.get(p.id);
      if (!v) pinVecs.set(p.id, (v = toVec(p.lon, p.lat)));
      return v;
    };

    const start = latest.current.pins[0];
    const st = {
      yaw: (start?.lon ?? -85) * RAD, tilt: (start?.lat ?? 40) * RAD * 0.8,
      zoom: 1, vYaw: 0, vTilt: 0, dragging: false, moved: 0, px: 0, py: 0, idleSince: 0, last: 0,
    };
    let width = 0, height = 0, dpr = 1, raf = 0, visible = true;
    const t0 = performance.now();
    const onScreen: { pin: GlobePin; x: number; y: number }[] = [];

    /** The globe's outline on screen; the sphere inside it grows by `st.zoom`. */
    const frame = () => Math.min(width, height) * 0.46;
    const radius = () => frame() * st.zoom;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = el.clientWidth;
      height = el.clientHeight;
      cv.width = Math.round(width * dpr);
      cv.height = Math.round(height * dpr);
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const R = frame(), r = radius(), cx = width / 2, cy = height / 2;

      // The sphere itself: a soft disc. When zoomed, everything is clipped to it like a lens.
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.fill;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.clip();

      // Land dots, in four brightness bands so the edge of the globe falls away.
      const size = Math.max(1.2, Math.min(r / 150, 2.6));
      const bands: Path2D[] = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      const cY = Math.cos(st.yaw), sY = Math.sin(st.yaw), cT = Math.cos(st.tilt), sT = Math.sin(st.tilt);
      for (let i = 0; i < dots.length; i += 3) {
        const x = dots[i]!, y = dots[i + 1]!, z = dots[i + 2]!;
        const x1 = x * cY - z * sY, z1 = x * sY + z * cY;
        const z2 = y * sT + z1 * cT;
        if (z2 <= 0) continue;
        const y2 = y * cT - z1 * sT;
        bands[Math.min(3, Math.floor(z2 * 4))]!.rect(cx + x1 * r - size / 2, cy - y2 * r - size / 2, size, size);
      }
      ctx.fillStyle = colors.land;
      bands.forEach((band, i) => {
        ctx.globalAlpha = 0.3 + i * 0.2;
        ctx.fill(band);
      });

      // School pins on the near side.
      const t = (now - t0) / 1000;
      const { pins: current, selectedId: chosen } = latest.current;
      onScreen.length = 0;
      for (const pin of current) {
        const [x, y, z] = rotate(vecOf(pin), st.yaw, st.tilt);
        if (z <= 0.05) continue;
        const px = cx + x * r, py = cy - y * r;
        if (Math.hypot(px - cx, py - cy) > R - 4) continue;
        onScreen.push({ pin, x: px, y: py });
        const active = pin.id === chosen;
        ctx.globalAlpha = Math.min(1, z * 3);
        if (active && !reduced) {
          const k = (t % 1.8) / 1.8;
          ctx.strokeStyle = colors.pin;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = (1 - k) * 0.6;
          ctx.beginPath();
          ctx.arc(px, py, 6 + k * 16, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = colors.halo;
        ctx.beginPath();
        ctx.arc(px, py, active ? 7.5 : 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = colors.pin;
        ctx.beginPath();
        ctx.arc(px, py, active ? 5.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // A fine rim, drawn last so the clipped edge stays crisp.
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors.rim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
    };

    const step = (now: number) => {
      const dt = st.last ? Math.min(0.05, (now - st.last) / 1000) : 1 / 60;
      st.last = now;
      const target = aim.current;
      st.zoom += ((target ? FOCUS_ZOOM : 1) - st.zoom) * (1 - Math.pow(0.02, dt));
      if (st.dragging) return;
      if (target) {
        // Ease toward the chosen school, centring it.
        const k = 1 - Math.pow(0.002, dt);
        st.yaw += shortestTurn(st.yaw, target.yaw) * k;
        st.tilt += (target.tilt - st.tilt) * k;
        st.vYaw = st.vTilt = 0;
      } else {
        st.yaw += st.vYaw * dt;
        st.tilt = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, st.tilt + st.vTilt * dt));
        st.vYaw *= Math.pow(0.05, dt);
        st.vTilt *= Math.pow(0.05, dt);
        if (now - st.idleSince > 2500) st.yaw -= dt * 0.12;
      }
    };

    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      step(now);
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    const play = () => {
      if (reduced) {
        // No continuous motion: jump straight to the chosen school.
        const target = aim.current;
        if (target && !st.dragging) { st.yaw = target.yaw; st.tilt = target.tilt; }
        st.zoom = target ? FOCUS_ZOOM : 1;
        draw(performance.now());
        return;
      }
      if (!raf && visible) { st.last = 0; raf = requestAnimationFrame(tick); }
    };

    const nearestPin = (e: PointerEvent) => {
      const box = cv.getBoundingClientRect();
      const x = e.clientX - box.left, y = e.clientY - box.top;
      let best: (typeof onScreen)[number] | undefined, bestDistance = HIT_RADIUS;
      for (const spot of onScreen) {
        const d = Math.hypot(spot.x - x, spot.y - y);
        if (d < bestDistance) { best = spot; bestDistance = d; }
      }
      return best;
    };

    const onDown = (e: PointerEvent) => {
      cv.setPointerCapture(e.pointerId);
      Object.assign(st, { dragging: true, moved: 0, px: e.clientX, py: e.clientY, vYaw: 0, vTilt: 0 });
    };
    const onMove = (e: PointerEvent) => {
      if (!st.dragging) {
        const near = nearestPin(e);
        cv.style.cursor = near ? 'pointer' : 'grab';
        setHovered(near && near.pin.id !== latest.current.selectedId ? near : null);
        return;
      }
      const r = radius();
      const dx = e.clientX - st.px, dy = e.clientY - st.py;
      st.px = e.clientX;
      st.py = e.clientY;
      st.moved += Math.abs(dx) + Math.abs(dy);
      if (st.moved < CLICK_SLOP) return;
      aim.current = null; // a drag takes over from the selection
      cv.style.cursor = 'grabbing';
      st.yaw -= dx / r;
      st.tilt = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, st.tilt + dy / r));
      st.vYaw = (-dx / r) * 30;
      st.vTilt = (dy / r) * 30;
      st.idleSince = performance.now();
      setHovered(null);
      if (reduced) { st.zoom = 1; draw(performance.now()); }
    };
    const onUp = (e: PointerEvent) => {
      if (!st.dragging) return;
      st.dragging = false;
      st.idleSince = performance.now();
      cv.style.cursor = 'grab';
      if (st.moved < CLICK_SLOP) {
        const near = nearestPin(e);
        if (near) latest.current.onSelect(near.pin.id);
      }
    };
    const onLeave = () => setHovered(null);

    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', onUp);
    cv.addEventListener('pointercancel', onUp);
    cv.addEventListener('pointerleave', onLeave);
    const resizer = new ResizeObserver(() => { resize(); draw(performance.now()); });
    resizer.observe(el);
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) play();
    });
    viewport.observe(el);
    const onVisibility = () => { if (!document.hidden) play(); };
    document.addEventListener('visibilitychange', onVisibility);
    redraw.current = play;
    resize();
    play();

    return () => {
      visible = false;
      cancelAnimationFrame(raf);
      redraw.current = null;
      resizer.disconnect();
      viewport.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      cv.removeEventListener('pointerdown', onDown);
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp);
      cv.removeEventListener('pointercancel', onUp);
      cv.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={host} className="relative aspect-square w-full">
      <canvas ref={canvas} role="img" aria-label={label} className="size-full cursor-grab touch-pan-y"/>
      {hovered && (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] rounded-field bg-ink px-2 py-1 text-xs whitespace-nowrap text-white shadow-soft"
          style={{ left: hovered.x, top: hovered.y }}
        >
          {hovered.pin.name}
        </p>
      )}
    </div>
  );
}
