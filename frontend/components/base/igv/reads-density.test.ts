import { describe, expect, it } from 'vitest';

import {
  type AlignmentSettings,
  type AlignmentTrack,
  applyReadsDensityRule,
  getVisibilityWindows,
  loadSliceCounter,
  type SliceCounter,
} from './reads-density';

const CHRM_LENGTH = 16569;

const createTrack = (name: string, featureSource?: AlignmentTrack['featureSource']) =>
  ({
    id: name,
    name,
    type: 'alignment',
    visibilityWindow: 30000,
    config: {},
    featureSource,
  }) as AlignmentTrack;

const createCramTrack = (chrToIndex: Record<string, number>, slicesBySeqId: Record<number, unknown[]>) =>
  createTrack('cram', {
    bamReader: {
      getHeader: () => Promise.resolve({ chrToIndex }),
      indexedCramFile: { index: { getIndex: () => Promise.resolve(slicesBySeqId as never) } },
    },
  });

describe('loadSliceCounter', () => {
  const slices = [
    { start: 0, span: 100 },
    { start: 100, span: 100 },
    { start: 200, span: 100 },
  ];

  it('counts the slices of the CRAM index that overlap a range', async () => {
    const countSlices = await loadSliceCounter(createCramTrack({ chr1: 3 }, { 3: slices }));

    expect(countSlices?.('chr1', 150, 250)).toBe(2);
    expect(countSlices?.('chr1', 0, 99)).toBe(1);
    expect(countSlices?.('chr1', 300, 400)).toBe(0);
  });

  it('falls back on MT for chrM', async () => {
    const countSlices = await loadSliceCounter(createCramTrack({ MT: 5 }, { 5: slices }));

    expect(countSlices?.('chrM', 0, CHRM_LENGTH)).toBe(3);
  });

  it('counts no slice on a chromosome missing from the CRAM file', async () => {
    const countSlices = await loadSliceCounter(createCramTrack({ chr1: 3 }, { 3: slices }));

    expect(countSlices?.('chr2', 0, 1000)).toBe(0);
  });

  it('gives no counter for a track without a CRAM index', async () => {
    const track = createTrack('bam', { bamReader: { getHeader: () => Promise.resolve({ chrToIndex: { chr1: 0 } }) } });

    expect(await loadSliceCounter(track)).toBeUndefined();
  });
});

describe('getVisibilityWindows', () => {
  it('leaves the tracks unrestricted when all their slices fit in the budget', () => {
    const windows = getVisibilityWindows(
      new Map([
        ['exome1', 40],
        ['exome2', 60],
      ]),
      CHRM_LENGTH,
    );

    expect(windows.size).toBe(0);
  });

  it('splits the budget equally between dense tracks, over three screens', () => {
    const windows = getVisibilityWindows(
      new Map([
        ['proband', 1000],
        ['mother', 1000],
        ['father', 1000],
      ]),
      CHRM_LENGTH,
    );

    expect([...windows.values()]).toEqual([552, 552, 552]);
  });

  it('gives what sparse tracks leave of the budget to the dense ones', () => {
    const windows = getVisibilityWindows(
      new Map([
        ['exome', 20],
        ['genome1', 1000],
        ['genome2', 1000],
      ]),
      CHRM_LENGTH,
    );

    expect(windows.has('exome')).toBe(false);
    expect(windows.get('genome1')).toBe(773);
    expect(windows.get('genome2')).toBe(773);
  });

  it('never goes below 500 bp', () => {
    expect(getVisibilityWindows(new Map([['deep', 100000]]), CHRM_LENGTH).get('deep')).toBe(500);
  });
});

describe('applyReadsDensityRule', () => {
  const DENSE_REGION = { start: 1_000_000, end: 1_100_000 };
  const DENSE_VIEW = { chr: 'chr1', start: 1_040_000, end: 1_060_000 };
  const SPARSE_VIEW = { chr: 'chr1', start: 5_000_000, end: 5_020_000 };

  // Dense in DENSE_REGION only, on any chromosome.
  const countGenomeSlices: SliceCounter = (_, start, end) =>
    start < DENSE_REGION.end && end > DENSE_REGION.start ? 1000 : 2;

  const setup = () => {
    const genome = createTrack('genome');
    const exome = createTrack('exome');
    const uncountable = createTrack('uncountable');
    const sliceCounters = new Map<AlignmentTrack, SliceCounter | undefined>([
      [genome, countGenomeSlices],
      [exome, () => 20],
      [uncountable, undefined],
    ]);
    const savedSettings = new Map<AlignmentTrack, AlignmentSettings>();
    return { genome, exome, uncountable, tracks: [genome, exome, uncountable], sliceCounters, savedSettings };
  };

  it('restricts the dense tracks of a region and returns the window that hides their reads', () => {
    const { genome, exome, uncountable, tracks, sliceCounters, savedSettings } = setup();

    expect(applyReadsDensityRule(tracks, sliceCounters, savedSettings, DENSE_VIEW)).toBe(5600);
    expect(genome.visibilityWindow).toBe(5600);
    expect(genome.config.samplingDepth).toBe(100);
    expect(exome.visibilityWindow).toBe(30000);
    expect(exome.config.samplingDepth).toBeUndefined();
    expect(uncountable.visibilityWindow).toBe(30000);
  });

  it('measures the density on the part of the three screens inside the chromosome', () => {
    const { genome, tracks, sliceCounters, savedSettings } = setup();
    sliceCounters.set(genome, () => 1000);
    const fullChrM = { chr: 'chrM', start: 0, end: CHRM_LENGTH, chrLength: CHRM_LENGTH };

    expect(applyReadsDensityRule(tracks, sliceCounters, savedSettings, fullChrM)).toBe(1546);
    expect(genome.visibilityWindow).toBe(1546);
  });

  it('gives the settings back when leaving the region', () => {
    const { genome, tracks, sliceCounters, savedSettings } = setup();
    applyReadsDensityRule(tracks, sliceCounters, savedSettings, DENSE_VIEW);

    expect(applyReadsDensityRule(tracks, sliceCounters, savedSettings, SPARSE_VIEW)).toBeUndefined();
    expect(genome.visibilityWindow).toBe(30000);
    expect(genome.config.samplingDepth).toBeUndefined();
  });

  it('returns no window when the view is within it', () => {
    const { genome, tracks, sliceCounters, savedSettings } = setup();

    expect(
      applyReadsDensityRule(tracks, sliceCounters, savedSettings, { chr: 'chr1', start: 1_050_000, end: 1_050_200 }),
    ).toBeUndefined();
    expect(genome.visibilityWindow).toBe(500);
  });

  it('leaves a view wider than the window of the track to igv.js', () => {
    const { genome, tracks, sliceCounters, savedSettings } = setup();

    expect(
      applyReadsDensityRule(tracks, sliceCounters, savedSettings, { chr: 'chr1', start: 1_000_000, end: 1_050_000 }),
    ).toBeUndefined();
    expect(genome.visibilityWindow).toBe(30000);
    expect(genome.config.samplingDepth).toBeUndefined();
  });

  it('gives the smallest window to a track whose index is being parsed, without reporting it', () => {
    const { tracks, sliceCounters, savedSettings } = setup();
    const pending = createTrack('pending');

    expect(applyReadsDensityRule([...tracks, pending], sliceCounters, savedSettings, SPARSE_VIEW)).toBeUndefined();
    expect(pending.visibilityWindow).toBe(500);
    expect(pending.config.samplingDepth).toBe(100);
  });

  it('restores a track once its index shows it is sparse', () => {
    const { exome, tracks, sliceCounters, savedSettings } = setup();
    sliceCounters.delete(exome);

    applyReadsDensityRule(tracks, sliceCounters, savedSettings, SPARSE_VIEW);
    expect(exome.visibilityWindow).toBe(500);

    sliceCounters.set(exome, () => 20);
    applyReadsDensityRule(tracks, sliceCounters, savedSettings, SPARSE_VIEW);
    expect(exome.visibilityWindow).toBe(30000);
    expect(exome.config.samplingDepth).toBeUndefined();
  });

  it('keeps a window set from the track menu', () => {
    const { genome, exome, tracks, sliceCounters, savedSettings } = setup();
    genome.visibilityWindow = 100000;
    exome.visibilityWindow = 5000;

    // The exome loads no reads in this view, so the genome gets the whole budget.
    applyReadsDensityRule(tracks, sliceCounters, savedSettings, DENSE_VIEW);
    expect(genome.visibilityWindow).toBe(6000);
    expect(exome.visibilityWindow).toBe(5000);

    applyReadsDensityRule(tracks, sliceCounters, savedSettings, SPARSE_VIEW);
    expect(genome.visibilityWindow).toBe(100000);
  });
});
