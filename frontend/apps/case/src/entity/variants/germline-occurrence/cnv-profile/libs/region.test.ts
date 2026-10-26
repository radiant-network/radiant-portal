import { describe, expect, it } from 'vitest';

import type { CNVProfileRegion } from '@/api/api';

import { withRegion } from './region';

const overview = [
  { chromosome: '1', positions: [100, 500, 900], values: [1, 1.1, 1.2] },
  { chromosome: '2', positions: [100], values: [0.9] },
];

const region: CNVProfileRegion = {
  chromosome: '1',
  start: 400,
  end: 800,
  copy_ratio: { chromosome: '1', positions: [420, 450, 780], values: [2, 2.1, 2.2] },
  baf: { chromosome: '1', positions: [], values: [] },
};

describe('withRegion', () => {
  it('replaces the overview points inside the region', () => {
    expect(withRegion(overview, region, r => r.copy_ratio)[0]).toEqual({
      chromosome: '1',
      positions: [100, 420, 450, 780, 900],
      values: [1, 2, 2.1, 2.2, 1.2],
    });
  });

  it('leaves the other chromosomes alone', () => {
    expect(withRegion(overview, region, r => r.copy_ratio)[1]).toBe(overview[1]);
  });

  it('keeps the overview without a region', () => {
    expect(withRegion(overview, undefined, r => r.copy_ratio)).toBe(overview);
  });

  it('empties the region when it has no point', () => {
    expect(withRegion(overview, region, r => r.baf)[0].positions).toEqual([100, 900]);
  });
});
