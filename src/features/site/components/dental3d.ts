/**
 * Dotted 3D dental objects for the hero. Each object is a union of simple solids (ellipsoids and
 * tapered rods); its surface is sampled into evenly spaced dots, dropping any dot buried inside
 * another solid. The result is a flat array of x, y, z, accent per dot, scaled to fit a unit sphere.
 */

export type Vec3 = [number, number, number];

export type Solid =
  | { kind: 'ellipsoid'; c: Vec3; r: Vec3; accent?: boolean }
  /** A rod from `a` to `b` whose radius tapers from `ra` to `rb`, with rounded ends. */
  | { kind: 'rod'; a: Vec3; b: Vec3; ra: number; rb: number; accent?: boolean };

const sub = (p: Vec3, q: Vec3): Vec3 => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const dot = (p: Vec3, q: Vec3) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const len = (p: Vec3) => Math.hypot(p[0], p[1], p[2]);
const scale = (p: Vec3, k: number): Vec3 => [p[0] * k, p[1] * k, p[2] * k];
const add = (p: Vec3, q: Vec3): Vec3 => [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
const cross = (p: Vec3, q: Vec3): Vec3 => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const unit = (p: Vec3): Vec3 => scale(p, 1 / (len(p) || 1));

/** Roughly how far `p` is outside the solid (negative inside). Approximate, which is all culling needs. */
export function distance(p: Vec3, s: Solid): number {
  if (s.kind === 'ellipsoid') {
    const q: Vec3 = [(p[0] - s.c[0]) / s.r[0], (p[1] - s.c[1]) / s.r[1], (p[2] - s.c[2]) / s.r[2]];
    return (len(q) - 1) * Math.min(...s.r);
  }
  const axis = sub(s.b, s.a);
  const t = Math.max(0, Math.min(1, dot(sub(p, s.a), axis) / dot(axis, axis)));
  return len(sub(p, add(s.a, scale(axis, t)))) - (s.ra + (s.rb - s.ra) * t);
}

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** `n` evenly spread directions on the unit sphere. */
function sphere(n: number): Vec3[] {
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const ring = Math.sqrt(1 - y * y);
    return [ring * Math.sin(GOLDEN * i), y, ring * Math.cos(GOLDEN * i)] as Vec3;
  });
}

function surface(s: Solid, spacing: number): Vec3[] {
  const cell = spacing * spacing;
  if (s.kind === 'ellipsoid') {
    const [a, b, c] = s.r;
    const p = 1.6;
    const area = 4 * Math.PI * Math.pow((Math.pow(a * b, p) + Math.pow(a * c, p) + Math.pow(b * c, p)) / 3, 1 / p);
    return sphere(Math.max(12, Math.round(area / cell))).map(d => add(s.c, [d[0] * a, d[1] * b, d[2] * c]));
  }
  const axis = sub(s.b, s.a);
  const length = len(axis);
  const w = unit(axis);
  const u = unit(cross(w, Math.abs(w[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
  const v = cross(w, u);
  const out: Vec3[] = [];
  const rings = Math.max(2, Math.round(length / spacing));
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const r = s.ra + (s.rb - s.ra) * t;
    const centre = add(s.a, scale(axis, t));
    const around = Math.max(3, Math.round((2 * Math.PI * r) / spacing));
    const twist = i * 0.5; // offset each ring so dots don't line up in stripes
    for (let k = 0; k < around; k++) {
      const angle = (2 * Math.PI * k) / around + twist;
      out.push(add(centre, add(scale(u, Math.cos(angle) * r), scale(v, Math.sin(angle) * r))));
    }
  }
  for (const [end, r] of [[s.a, s.ra], [s.b, s.rb]] as const) {
    const n = Math.max(2, Math.round((4 * Math.PI * r * r) / cell));
    for (const d of sphere(n)) out.push(add(end, scale(d, r)));
  }
  return out;
}

/** Dots on the outer surface of a union of solids, as [x, y, z, accent] quads fitted to the unit sphere. */
export function buildShape(solids: Solid[], spacing: number): Float32Array {
  const kept: [Vec3, number][] = [];
  const slack = spacing * 0.25;
  for (const s of solids) {
    for (const p of surface(s, spacing)) {
      if (solids.every(other => other === s || distance(p, other) > -slack)) kept.push([p, s.accent ? 1 : 0]);
    }
  }
  // Centre on the bounding box, then scale so the farthest dot sits on the unit sphere.
  const lo: Vec3 = [Infinity, Infinity, Infinity], hi: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const [p] of kept) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k]!, p[k]!); hi[k] = Math.max(hi[k]!, p[k]!); }
  const mid = scale(add(lo, hi), 0.5);
  const reach = Math.max(...kept.map(([p]) => len(sub(p, mid)))) || 1;
  const out = new Float32Array(kept.length * 4);
  kept.forEach(([p, accent], i) => {
    const q = scale(sub(p, mid), 1 / reach);
    out.set([q[0], q[1], q[2], accent], i * 4);
  });
  return out;
}

/** A lower molar: a crown with four cusps, and three roots. */
export const molar: Solid[] = [
  { kind: 'ellipsoid', c: [0, 0.3, 0], r: [0.95, 0.55, 0.82] },
  ...([[-1, -1], [-1, 1], [1, -1], [1, 1]] as const).map(([x, z]) => (
    { kind: 'ellipsoid', c: [x * 0.42, 0.68, z * 0.34], r: [0.4, 0.3, 0.38] } satisfies Solid
  )),
  { kind: 'ellipsoid', c: [0, -0.05, 0], r: [0.78, 0.45, 0.66] },
  { kind: 'rod', a: [-0.36, -0.15, -0.1], b: [-0.52, -1.4, -0.05], ra: 0.34, rb: 0.09 },
  { kind: 'rod', a: [0.36, -0.15, -0.1], b: [0.5, -1.4, -0.05], ra: 0.34, rb: 0.09 },
  { kind: 'rod', a: [0, -0.15, 0.3], b: [0.04, -1.2, 0.5], ra: 0.28, rb: 0.08 },
];

/** A toothbrush lying along x, with a tuft of accent-coloured bristles. */
export const toothbrush: Solid[] = [
  { kind: 'rod', a: [-1.7, -0.05, 0], b: [0.5, 0.06, 0], ra: 0.15, rb: 0.1 },
  { kind: 'rod', a: [0.5, 0.06, 0], b: [1.05, 0.13, 0], ra: 0.1, rb: 0.07 },
  { kind: 'ellipsoid', c: [1.34, 0.15, 0], r: [0.34, 0.08, 0.14] },
  ...Array.from({ length: 7 }, (_, i) => [-0.07, 0.07].map(z => (
    { kind: 'rod', a: [1.1 + i * 0.085, 0.2, z], b: [1.1 + i * 0.085, 0.48, z], ra: 0.03, rb: 0.03, accent: true } satisfies Solid
  ))).flat(),
];

/** A dental mirror: a slim handle, an angled neck and a round mirror face. */
export const dentalMirror: Solid[] = [
  { kind: 'rod', a: [-1.5, 0, 0], b: [0.65, 0, 0], ra: 0.075, rb: 0.065 },
  { kind: 'rod', a: [0.65, 0, 0], b: [0.98, 0.16, 0], ra: 0.04, rb: 0.035 },
  { kind: 'ellipsoid', c: [1.18, 0.3, 0], r: [0.3, 0.3, 0.03], accent: true },
  { kind: 'ellipsoid', c: [1.18, 0.3, -0.035], r: [0.33, 0.33, 0.045] },
];

/** A toothpaste tube: a flattened body, a crimped end and an accent cap. */
export const toothpaste: Solid[] = [
  { kind: 'ellipsoid', c: [0, 0, 0], r: [1.05, 0.34, 0.24] },
  { kind: 'ellipsoid', c: [-1.08, 0, 0], r: [0.08, 0.36, 0.05] },
  { kind: 'rod', a: [0.95, 0, 0], b: [1.18, 0, 0], ra: 0.17, rb: 0.17 },
  { kind: 'rod', a: [1.18, 0, 0], b: [1.42, 0, 0], ra: 0.19, rb: 0.17, accent: true },
];
