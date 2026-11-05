import type { ReferenceGenome, TrackLoad, TrackType } from 'igv';

export type IGVContext = 'snv' | 'cnv';

// igv.js reads these reference fields, which its types leave out.
export type IGVReference = ReferenceGenome & {
  ucscID?: string;
  blatDB?: string;
  tracks?: TrackLoad<TrackType>[];
};
