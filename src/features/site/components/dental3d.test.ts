import { buildShape, dentalMirror, distance, molar, toothbrush, toothpaste, type Solid } from './dental3d';

describe('dental shapes', () => {
  it.each([['molar', molar], ['toothbrush', toothbrush], ['mirror', dentalMirror], ['toothpaste', toothpaste]])(
    'samples the %s into dots that fit the unit sphere',
    (_, solids) => {
      const dots = buildShape(solids, 0.08);
      expect(dots.length % 4).toBe(0);
      expect(dots.length / 4).toBeGreaterThan(150);
      let farthest = 0;
      for (let i = 0; i < dots.length; i += 4) farthest = Math.max(farthest, Math.hypot(dots[i]!, dots[i + 1]!, dots[i + 2]!));
      expect(farthest).toBeCloseTo(1, 5);
    },
  );

  it('marks only the toothbrush bristles as accent dots', () => {
    const dots = buildShape(toothbrush, 0.08);
    let accent = 0;
    for (let i = 3; i < dots.length; i += 4) accent += dots[i]!;
    expect(accent).toBeGreaterThan(0);
    expect(accent).toBeLessThan(dots.length / 4 / 2);
    expect(buildShape(molar, 0.08).filter((_, i) => i % 4 === 3).every(a => a === 0)).toBe(true);
  });

  it('measures distance to a rod as negative inside and positive outside', () => {
    const rod: Solid = { kind: 'rod', a: [0, 0, 0], b: [2, 0, 0], ra: 0.5, rb: 0.5 };
    expect(distance([1, 0, 0], rod)).toBeCloseTo(-0.5);
    expect(distance([1, 1, 0], rod)).toBeCloseTo(0.5);
  });
});
