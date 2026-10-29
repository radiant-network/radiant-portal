import { describe, expect, it, vi } from 'vitest';

import { type AlignmentTrack, applyChrMDensityRule, countChrMSlices, getChrMVisibilityWindows } from './chrm-density';

const CHRM_LENGTH = 16569;

const createTrack = (name: string, featureSource?: AlignmentTrack['featureSource']): AlignmentTrack => ({
  id: name,
  name,
  type: 'alignment',
  visibilityWindow: 30000,
  config: {},
  featureSource,
});

const createCramTrack = (chrToIndex: Record<string, number>, slices: unknown[]) => {
  const getEntriesForRange = vi.fn().mockResolvedValue(slices);
  const track = createTrack('cram', {
    bamReader: {
      getHeader: () => Promise.resolve({ chrToIndex }),
      indexedCramFile: { index: { getEntriesForRange } },
    },
  });
  return { track, getEntriesForRange };
};

describe('countChrMSlices', () => {
  it('counts the chrM slices in the CRAM index', async () => {
    const { track, getEntriesForRange } = createCramTrack({ chr1: 0, chrM: 24 }, [{}, {}, {}]);

    expect(await countChrMSlices(track)).toBe(3);
    expect(getEntriesForRange).toHaveBeenCalledWith(24, 0, CHRM_LENGTH);
  });

  it('falls back on MT', async () => {
    const { track, getEntriesForRange } = createCramTrack({ MT: 5 }, []);

    expect(await countChrMSlices(track)).toBe(0);
    expect(getEntriesForRange).toHaveBeenCalledWith(5, 0, CHRM_LENGTH);
  });

  it('gives no count for a track without a CRAM index', async () => {
    const track = createTrack('bam', { bamReader: { getHeader: () => Promise.resolve({ chrToIndex: { chrM: 0 } }) } });

    expect(await countChrMSlices(track)).toBeUndefined();
  });
});

describe('getChrMVisibilityWindows', () => {
  it('leaves the tracks unrestricted when all their slices fit in the budget', () => {
    const windows = getChrMVisibilityWindows(
      new Map([
        ['exome1', 40],
        ['exome2', 60],
      ]),
    );

    expect(windows.size).toBe(0);
  });

  it('splits the budget equally between dense tracks, over three screens', () => {
    const windows = getChrMVisibilityWindows(
      new Map([
        ['proband', 1000],
        ['mother', 1000],
        ['father', 1000],
      ]),
    );

    expect([...windows.values()]).toEqual([552, 552, 552]);
  });

  it('gives what sparse tracks leave of the budget to the dense ones', () => {
    const windows = getChrMVisibilityWindows(
      new Map([
        ['exome', 20],
        ['genome1', 1000],
        ['genome2', 1000],
      ]),
    );

    expect(windows.has('exome')).toBe(false);
    expect(windows.get('genome1')).toBe(773);
    expect(windows.get('genome2')).toBe(773);
  });

  it('never goes below 500 bp', () => {
    expect(getChrMVisibilityWindows(new Map([['deep', 100000]])).get('deep')).toBe(500);
  });
});

describe('applyChrMDensityRule', () => {
  const setup = () => {
    const genome = createTrack('genome');
    const exome = createTrack('exome');
    const uncounted = createTrack('uncounted');
    const sliceCounts = new Map([
      [genome, 1000],
      [exome, 20],
    ]);
    return { genome, exome, uncounted, tracks: [genome, exome, uncounted], sliceCounts };
  };

  it('restricts the dense tracks on chrM and returns the window that hides their reads', () => {
    const { genome, exome, uncounted, tracks, sliceCounts } = setup();

    expect(applyChrMDensityRule(tracks, sliceCounts, { chr: 'chrM', start: 0, end: CHRM_LENGTH })).toBe(1546);
    expect(genome.visibilityWindow).toBe(1546);
    expect(genome.config.samplingDepth).toBe(100);
    expect(exome.visibilityWindow).toBe(30000);
    expect(exome.config.samplingDepth).toBeUndefined();
    expect(uncounted.visibilityWindow).toBe(30000);
  });

  it('returns no window when the view is within it', () => {
    const { genome, tracks, sliceCounts } = setup();

    expect(applyChrMDensityRule(tracks, sliceCounts, { chr: 'chrM', start: 100, end: 300 })).toBeUndefined();
    expect(genome.visibilityWindow).toBe(1546);
  });

  it('restores the defaults off chrM', () => {
    const { genome, tracks, sliceCounts } = setup();
    applyChrMDensityRule(tracks, sliceCounts, { chr: 'chrM', start: 0, end: CHRM_LENGTH });

    expect(applyChrMDensityRule(tracks, sliceCounts, { chr: 'chr1', start: 0, end: 50000 })).toBeUndefined();
    expect(genome.visibilityWindow).toBe(30000);
    expect(genome.config.samplingDepth).toBeUndefined();
  });
});
