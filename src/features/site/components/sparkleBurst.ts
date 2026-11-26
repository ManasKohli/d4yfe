/**
 * A short burst of little teeth and sparkles from a point on screen, drawn on a temporary canvas
 * that removes itself when the last piece has faded. Decorative; does nothing under reduced motion.
 */

/** The tooth from the site's icon set (a 24 × 24 path), so the burst matches the brand mark. */
const TOOTH = 'M7.2 3.6c2.5 0 3.1 1.3 4.8 1.3s2.3-1.3 4.8-1.3c2.8 0 4 2.3 3.6 5.5-.4 3.1-2.3 10.8-4.2 11.2-1.7.4-2.3-5.9-4.2-5.9s-2.5 6.3-4.2 5.9C5.9 19.9 4 12.2 3.6 9.1c-.4-3.2.8-5.5 3.6-5.5Z';

export type PieceKind = 'tooth' | 'glint' | 'dot';

export interface Piece {
  kind: PieceKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  angle: number;
  size: number;
  color: number;
}

const LIFE_SECONDS = 1.5;
const GRAVITY = 900;

/** The pieces of one burst at (x, y), flung mostly upward in a fan. `random` is injectable for tests. */
export function makeBurst(x: number, y: number, count: number, random: () => number = Math.random): Piece[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (random() - 0.5) * Math.PI * 0.9;
    const speed = 260 + random() * 340;
    const kind: PieceKind = i % 3 === 0 ? 'tooth' : i % 3 === 1 ? 'glint' : 'dot';
    return {
      kind, x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      spin: (random() - 0.5) * 10,
      angle: random() * Math.PI * 2,
      size: kind === 'tooth' ? 9 + random() * 5 : kind === 'glint' ? 5 + random() * 4 : 2 + random() * 2,
      color: Math.floor(random() * 3),
    };
  });
}

export function sparkleBurst(x: number, y: number, count = 36) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas');
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(window.innerWidth * dpr);
  cv.height = Math.round(window.innerHeight * dpr);
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:60';
  document.body.append(cv);

  const css = getComputedStyle(document.documentElement);
  const palette = ['--color-blue', '--color-steel', '--color-coral'].map(name => css.getPropertyValue(name).trim());
  const tooth = new Path2D(TOOTH);
  const pieces = makeBurst(x, y, count);
  const start = performance.now();
  let last = start;

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const age = (now - start) / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalAlpha = Math.max(0, 1 - Math.pow(age / LIFE_SECONDS, 2));
    for (const p of pieces) {
      p.vy += GRAVITY * dt;
      p.vx *= Math.pow(0.4, dt);
      p.vy *= Math.pow(0.6, dt);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.angle += p.spin * dt;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = palette[p.color] ?? palette[0]!;
      if (p.kind === 'tooth') {
        const k = p.size / 24;
        ctx.scale(k, k);
        ctx.translate(-12, -12);
        ctx.fill(tooth);
      } else if (p.kind === 'glint') {
        const r = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (age < LIFE_SECONDS) requestAnimationFrame(frame);
    else cv.remove();
  };
  requestAnimationFrame(frame);
  // Animation frames pause in background tabs; make sure the canvas never lingers.
  window.setTimeout(() => cv.remove(), LIFE_SECONDS * 1000 + 500);
}
