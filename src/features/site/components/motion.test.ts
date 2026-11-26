import { liftFor, sweepProgress, tiltFor } from './motion';
import { makeBurst } from './sparkleBurst';

describe('toothbrush sweep progress', () => {
  it('waits below the fold, runs as the steps rise, and stops at the end', () => {
    expect(sweepProgress(900, 1000)).toBe(0);
    expect(sweepProgress(850, 1000)).toBe(0);
    expect(sweepProgress(625, 1000)).toBeCloseTo(0.5);
    expect(sweepProgress(400, 1000)).toBe(1);
    expect(sweepProgress(-200, 1000)).toBe(1);
  });
});

describe('card tilt', () => {
  it('stays level at the centre and leans toward the pointer within six degrees', () => {
    const centre = tiltFor(100, 50, 200, 100);
    expect(Math.abs(centre.rotateX)).toBe(0);
    expect(Math.abs(centre.rotateY)).toBe(0);
    expect(tiltFor(200, 0, 200, 100)).toEqual({ rotateX: 6, rotateY: 6 });
    expect(tiltFor(-50, 300, 200, 100)).toEqual({ rotateX: -6, rotateY: -6 });
  });
});


describe('sparkle burst', () => {
  it('flings a mix of teeth, glints and dots upward from the click', () => {
    let n = 0;
    const steady = () => ((n = (n * 7 + 3) % 11) / 11);
    const pieces = makeBurst(100, 200, 30, steady);
    expect(pieces).toHaveLength(30);
    expect(new Set(pieces.map(p => p.kind))).toEqual(new Set(['tooth', 'glint', 'dot']));
    expect(pieces.every(p => p.x === 100 && p.y === 200 && p.vy < 0)).toBe(true);
  });
});

describe('footer tooth lift', () => {
  it('lifts the tooth under the pointer most, eases off, and stops at the reach', () => {
    expect(liftFor(0)).toBe(1);
    expect(liftFor(60)).toBeCloseTo(0.5);
    expect(liftFor(-60)).toBeCloseTo(0.5);
    expect(liftFor(120)).toBe(0);
    expect(liftFor(400)).toBe(0);
  });
});
