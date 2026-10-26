import { describe, expect, it } from 'vitest';

import { assignLanes } from './gene-lanes';

describe('assignLanes', () => {
  it('keeps apart genes in the first lane', () => {
    const items = [
      { start: 0, end: 100, label: 'A' },
      { start: 1000, end: 1100, label: 'B' },
    ];
    expect(assignLanes(items, 1)).toEqual([
      { lane: 0, labelled: true },
      { lane: 0, labelled: true },
    ]);
  });

  it('moves an overlapping gene to the next lane', () => {
    const items = [
      { start: 0, end: 100, label: 'A' },
      { start: 50, end: 150, label: 'B' },
    ];
    expect(assignLanes(items, 1)).toEqual([
      { lane: 0, labelled: true },
      { lane: 1, labelled: true },
    ]);
  });

  it('reserves room for a label wider than its gene', () => {
    // At 1 px per base, the 1-letter label takes 19.5 px: the genes 5 bases apart collide.
    const items = [
      { start: 0, end: 1, label: 'A' },
      { start: 6, end: 7, label: 'B' },
    ];
    expect(assignLanes(items, 1).map(a => a.lane)).toEqual([0, 1]);
    expect(assignLanes(items, 100).map(a => a.lane)).toEqual([0, 0]);
  });

  it('leaves a gene unlabelled when every lane is taken', () => {
    const items = [
      { start: 0, end: 100, label: 'A' },
      { start: 10, end: 100, label: 'B' },
      { start: 20, end: 90, label: 'C' },
    ];
    expect(assignLanes(items, 1, 2)).toEqual([
      { lane: 0, labelled: true },
      { lane: 1, labelled: true },
      { lane: 0, labelled: false },
    ]);
  });

  it('labels the primary genes first', () => {
    const items = [
      { start: 0, end: 100, label: 'A' },
      { start: 10, end: 100, label: 'B', primary: true },
    ];
    expect(assignLanes(items, 1, 1)).toEqual([
      { lane: 0, labelled: false },
      { lane: 0, labelled: true },
    ]);
  });
});
