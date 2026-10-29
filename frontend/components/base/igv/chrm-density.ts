import type { Tracks } from 'igv';

const CHRM = 'chrM';
const CHRM_LENGTH = 16569;
const CHRM_SLICE_BUDGET = 300;
const CHRM_MIN_VISIBILITY_WINDOW = 500;
const CHRM_SAMPLING_DEPTH = 100;
const ALIGNMENT_VISIBILITY_WINDOW = 30000;

type CramReader = {
  getHeader?: () => Promise<{ chrToIndex: Record<string, number> }>;
  indexedCramFile?: {
    index: { getEntriesForRange: (seqId: number, start: number, end: number) => Promise<unknown[]> };
  };
};

// igv.js internals, absent from its types: the BAMTrack fields that the rule reads and sets.
export type AlignmentTrack = Tracks.Track & {
  visibilityWindow: number | string;
  config: { samplingDepth?: number };
  featureSource?: { bamReader?: CramReader };
};

type Locus = { chr: string; start: number; end: number };

export const countChrMSlices = async (track: AlignmentTrack) => {
  const reader = track.featureSource?.bamReader;
  if (!reader?.getHeader || !reader.indexedCramFile) return undefined;

  const { chrToIndex } = await reader.getHeader();
  const seqId = chrToIndex[CHRM] ?? chrToIndex.MT;
  if (seqId === undefined) return undefined;

  const slices = await reader.indexedCramFile.index.getEntriesForRange(seqId, 0, CHRM_LENGTH);
  return slices.length;
};

// Sparse tracks keep all their slices; the dense ones share what is left of the budget.
export const getChrMVisibilityWindows = <T>(sliceCounts: Map<T, number>, budget = CHRM_SLICE_BUDGET) => {
  const windows = new Map<T, number>();
  let remainingBudget = budget;
  let remainingTracks = sliceCounts.size;

  for (const [track, sliceCount] of [...sliceCounts].sort(([, a], [, b]) => a - b)) {
    const share = remainingBudget / remainingTracks;
    if (sliceCount <= share) {
      remainingBudget -= sliceCount;
      remainingTracks -= 1;
    } else {
      // igv.js loads three screens: the view and one on each side.
      const window = Math.floor(((share / sliceCount) * CHRM_LENGTH) / 3);
      windows.set(track, Math.max(CHRM_MIN_VISIBILITY_WINDOW, window));
    }
  }
  return windows;
};

// Returns the smallest reduced window when it hides reads in the view.
export const applyChrMDensityRule = (
  tracks: AlignmentTrack[],
  sliceCounts: Map<AlignmentTrack, number>,
  { chr, start, end }: Locus,
) => {
  const countedTracks = new Map(
    tracks.flatMap(track => {
      const sliceCount = sliceCounts.get(track);
      return sliceCount === undefined ? [] : [[track, sliceCount] as const];
    }),
  );
  const windows = chr === CHRM ? getChrMVisibilityWindows(countedTracks) : new Map<AlignmentTrack, number>();

  for (const track of tracks) {
    const window = windows.get(track);
    track.visibilityWindow = window ?? ALIGNMENT_VISIBILITY_WINDOW;
    track.config.samplingDepth = window === undefined ? undefined : CHRM_SAMPLING_DEPTH;
  }

  const smallestWindow = Math.min(...windows.values());
  return end - start > smallestWindow ? smallestWindow : undefined;
};
