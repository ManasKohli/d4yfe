import { describe, expect, it } from 'vitest';
import { paths } from '@/app/paths';
import { detailSections } from '@/data/program';

describe('program details sections', () => {
  it('has one entry per anchor, with no duplicates', () => {
    const ids = detailSections.map(section => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers every program-details anchor in paths, so no link lands on a missing section', () => {
    const anchors = Object.values(paths)
      .filter(path => path.startsWith(`${paths.programDetails}#`))
      .map(path => path.split('#')[1]);
    expect(anchors.length).toBeGreaterThan(0);
    for (const anchor of anchors) expect(detailSections.map(section => section.id)).toContain(anchor);
  });
});
