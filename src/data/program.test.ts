import { describe, expect, it } from 'vitest';
import { paths } from '@/app/paths';
import { homeSections, schools } from '@/data/program';

describe('home page sections', () => {
  it('has one entry per anchor, with no duplicates', () => {
    const ids = homeSections.map(section => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers every home anchor in paths, so no link lands on a missing section', () => {
    const anchors = Object.values(paths)
      .filter(path => path.startsWith(`${paths.home}#`))
      .map(path => path.split('#')[1]);
    expect(anchors.length).toBeGreaterThan(0);
    for (const anchor of anchors) expect(homeSections.map(section => section.id)).toContain(anchor);
  });
});

describe('school carousel', () => {
  it('lists each school once', () => {
    expect(new Set(schools.map(school => school.name)).size).toBe(schools.length);
  });
});
