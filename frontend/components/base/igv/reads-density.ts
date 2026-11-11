import type { TrackOf } from 'igv';

const CHRM = 'chrM';
const READS_SLICE_BUDGET = 300;
const MIN_READS_VISIBILITY_WINDOW = 500;
const DENSE_READS_SAMPLING_DEPTH = 100;

type IndexedSlice = { start: number; span: number };

type CramReader = {
  getHeader?: () => Promise<{ chrToIndex: Record<string, number> }>;
  indexedCramFile?: { index: { getIndex: () => Promise<Record<number, IndexedSlice[] | undefined>> } };
};

// igv.js internals, absent from its types: the BAMTrack fields that the rule reads and sets.
export type AlignmentTrack = TrackOf<'alignment'> & {
  visibilityWindow: number | string;
  config: { samplingDepth?: number };
  featureSource?: { bamReader?: CramReader };
};

export type AlignmentSettings = { visibilityWindow: number | string; samplingDepth?: number };

export type SliceCounter = (chr: string, start: number, end: number) => number;

type View = { chr: string; start: number; end: number; chrLength?: number };

// Counts on the CRAM index igv.js reads its own slices from: parsed once, then counted synchronously in the
// locus change, which igv.js fires before it loads the view.
export const loadSliceCounter = async (track: AlignmentTrack): Promise<SliceCounter | undefined> => {
  const reader = track.featureSource?.bamReader;
  if (!reader?.getHeader || !reader.indexedCramFile) return undefined;

  const [{ chrToIndex }, slicesBySeqId] = await Promise.all([
    reader.getHeader(),
    reader.indexedCramFile.index.getIndex(),
  ]);
  return (chr, start, end) => {
    const seqId = chrToIndex[chr] ?? (chr === CHRM ? chrToIndex.MT : undefined);
    const slices = seqId === undefined ? [] : (slicesBySeqId[seqId] ?? []);
    return slices.filter(slice => slice.start <= end && slice.start + slice.span > start).length;
  };
};

// Sparse tracks keep all their slices; the dense ones share what is left of the budget.
export const getVisibilityWindows = <T>(
  sliceCounts: Map<T, number>,
  loadedWidth: number,
  budget = READS_SLICE_BUDGET,
) => {
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
      const window = Math.floor(((share / sliceCount) * loadedWidth) / 3);
      windows.set(track, Math.max(MIN_READS_VISIBILITY_WINDOW, window));
    }
  }
  return windows;
};

// Returns the smallest window of the dense tracks when it hides their reads in the view.
export const applyReadsDensityRule = (
  tracks: AlignmentTrack[],
  sliceCounters: Map<AlignmentTrack, SliceCounter | undefined>,
  savedSettings: Map<AlignmentTrack, AlignmentSettings>,
  { chr, start, end, chrLength = Infinity }: View,
) => {
  const width = end - start;
  const loadedStart = Math.max(0, start - width);
  const loadedEnd = Math.min(chrLength, end + width);

  // Above its own window, igv.js loads no reads of a track: there is nothing to restrict.
  const loadingTracks = tracks.filter(track => {
    const ownWindow = Number((savedSettings.get(track) ?? track).visibilityWindow);
    return ownWindow <= 0 || width <= ownWindow;
  });
  const sliceCounts = new Map(
    loadingTracks.flatMap(track => {
      const countSlices = sliceCounters.get(track);
      return countSlices ? [[track, countSlices(chr, loadedStart, loadedEnd)] as const] : [];
    }),
  );
  const denseWindows = getVisibilityWindows(sliceCounts, loadedEnd - loadedStart);
  const windows = new Map(denseWindows);
  // Until its index is parsed, a track may be dense: it gets the smallest window.
  for (const track of loadingTracks) {
    if (!sliceCounters.has(track)) windows.set(track, MIN_READS_VISIBILITY_WINDOW);
  }

  // A track gets back the settings it had before the rule, so a window set from its menu is kept.
  for (const track of tracks) {
    const window = windows.get(track);
    const saved = savedSettings.get(track);
    if (window !== undefined) {
      if (!saved) {
        savedSettings.set(track, {
          visibilityWindow: track.visibilityWindow,
          samplingDepth: track.config.samplingDepth,
        });
      }
      track.visibilityWindow = window;
      track.config.samplingDepth = DENSE_READS_SAMPLING_DEPTH;
    } else if (saved) {
      track.visibilityWindow = saved.visibilityWindow;
      track.config.samplingDepth = saved.samplingDepth;
      savedSettings.delete(track);
    }
  }

  const smallestWindow = Math.min(...denseWindows.values());
  return width > smallestWindow ? smallestWindow : undefined;
};
