import { describe, expect, it } from 'vitest';
import { paths } from '@/app/paths';
import { detailSections, packageTiers } from '@/data/program';

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

describe('package tiers', () => {
  it('lists the same lines in the same order on every card, so the cards line up', () => {
    const labels = packageTiers.map(tier => tier.includes.map(line => line.label).join('|'));
    expect(new Set(labels).size).toBe(1);
  });
});
