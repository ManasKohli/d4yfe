import { landMask } from './landMask';

/**
 * Geometry for the dotted school globe. A unit sphere with +y north and +z toward the viewer;
 * `yaw` turns the globe about its axis and `tilt` leans the north pole toward the viewer.
 * Pointing the globe at (lon, lat) means yaw = lon and tilt = lat, both in radians.
 */

export type Vec3 = [number, number, number];

const RAD = Math.PI / 180;

export const toVec = (lon: number, lat: number): Vec3 => {
  const cl = Math.cos(lat * RAD);
  return [cl * Math.sin(lon * RAD), Math.sin(lat * RAD), cl * Math.cos(lon * RAD)];
};

export const rotate = ([x, y, z]: Vec3, yaw: number, tilt: number): Vec3 => {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
  const x1 = x * cy - z * sy;
  const z1 = x * sy + z * cy;
  return [x1, y * ct - z1 * st, y * st + z1 * ct];
};

const MASK_WIDTH = 360;
const MASK_HEIGHT = 180;
let maskBits: Uint8Array | null = null;

/** True when (lon, lat) falls in a 1° cell that is mostly land (Natural Earth 1:50m, public domain). */
export function isLand(lon: number, lat: number): boolean {
  maskBits ??= Uint8Array.from(atob(landMask), c => c.charCodeAt(0));
  const i = Math.min(MASK_WIDTH - 1, Math.floor(((lon + 180) % 360 + 360) % 360));
  const j = Math.min(MASK_HEIGHT - 1, Math.max(0, Math.floor(90 - lat)));
  const k = j * MASK_WIDTH + i;
  return ((maskBits[k >> 3] ?? 0) >> (k & 7) & 1) === 1;
}

/** Evenly spread points (a Fibonacci sphere) that land on land, as flat xyz triples. */
export function landDots(count: number): Float32Array {
  const out: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let n = 0; n < count; n++) {
    const y = 1 - (2 * (n + 0.5)) / count;
    const ring = Math.sqrt(1 - y * y);
    const a = golden * n;
    const x = ring * Math.sin(a), z = ring * Math.cos(a);
    if (isLand(Math.atan2(x, z) / RAD, Math.asin(y) / RAD)) out.push(x, y, z);
  }
  return Float32Array.from(out);
}

/** The signed shortest turn from angle `from` to angle `to`, in radians. */
export const shortestTurn = (from: number, to: number) => {
  const d = (to - from) % (2 * Math.PI);
  return d > Math.PI ? d - 2 * Math.PI : d < -Math.PI ? d + 2 * Math.PI : d;
};
