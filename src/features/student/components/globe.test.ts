import { isLand, landDots, rotate, shortestTurn, toVec } from './globe';

const RAD = Math.PI / 180;

describe('globe geometry', () => {
  it('knows land from sea at the school cities and in open ocean', () => {
    expect(isLand(-79.39, 43.8)).toBe(true);   // Toronto
    expect(isLand(-113.53, 53.52)).toBe(true); // Edmonton
    expect(isLand(-40, 35)).toBe(false);       // mid-Atlantic
    expect(isLand(-150, 0)).toBe(false);       // central Pacific
  });

  it('turns a point to face the viewer when aimed at its longitude and latitude', () => {
    const [x, y, z] = rotate(toVec(-79.39, 43.66), -79.39 * RAD, 43.66 * RAD);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(1);
  });

  it('keeps only land points, all on the unit sphere', () => {
    const dots = landDots(4000);
    const count = dots.length / 3;
    // Land is about 29% of the surface.
    expect(count / 4000).toBeGreaterThan(0.24);
    expect(count / 4000).toBeLessThan(0.36);
    expect(Math.hypot(dots[0]!, dots[1]!, dots[2]!)).toBeCloseTo(1);
  });

  it('takes the short way round', () => {
    expect(shortestTurn(170 * RAD, -170 * RAD)).toBeCloseTo(20 * RAD);
    expect(shortestTurn(-170 * RAD, 170 * RAD)).toBeCloseTo(-20 * RAD);
  });
});
