import type { CaseTrack } from './case-tracks';
import type { IGVContext } from './types';

// Above this width, the expanded reads of a dense file (a genome, for instance) take seconds to draw.
const EXPANDED_READS_MAX_WIDTH = 5_000;

export type ReadsDisplayMode = 'EXPANDED' | 'SQUISHED';

// igv.js internals, absent from its types: the reads part of a BAMTrack, which its menu switches.
type ReadsTrack = { alignmentTrack?: { setDisplayMode: (mode: ReadsDisplayMode) => void } };

export const getReadsDisplayMode = (width: number): ReadsDisplayMode =>
  width <= EXPANDED_READS_MAX_WIDTH ? 'EXPANDED' : 'SQUISHED';

export const getLocusWidth = (locus: string) => {
  const [, start, end] = locus.match(/:(\d+)-(\d+)$/) ?? [];
  return start && end ? Number(end) - Number(start) : 0;
};

// Only a CNV opens IGV on a wide view: from an SNV the reads keep the igv.js display, with no rule.
export const getInitialReadsDisplayMode = (context: IGVContext, locus: string) =>
  context === 'cnv' ? getReadsDisplayMode(getLocusWidth(locus)) : undefined;

export const withReadsDisplayMode = (tracks: CaseTrack[], displayMode: ReadsDisplayMode | undefined): CaseTrack[] =>
  displayMode ? tracks.map(track => (track.type === 'alignment' ? { ...track, displayMode } : track)) : tracks;

// Switches the reads only when the view crosses the width, so a mode picked in the igv.js menu stays until then.
export const applyReadsDisplayMode = (tracks: unknown[], current: ReadsDisplayMode | undefined, width: number) => {
  if (!current) return undefined;
  const mode = getReadsDisplayMode(width);
  if (mode !== current) tracks.forEach(track => (track as ReadsTrack).alignmentTrack?.setDisplayMode(mode));
  return mode;
};
