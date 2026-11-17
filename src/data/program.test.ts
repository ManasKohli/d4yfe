import { describe, expect, it } from 'vitest';
import { packageFeatures, programPackages } from '@/data/program';

describe('package comparison', () => {
  it('gives every feature row one value per package, so no table cell is missing', () => {
    for (const feature of packageFeatures) expect(feature.values).toHaveLength(programPackages.length);
  });
});
