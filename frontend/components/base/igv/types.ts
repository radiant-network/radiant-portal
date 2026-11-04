import type { ReferenceGenome, TrackLoad, TrackType } from 'igv';

// igv.js reads these reference fields, which its types leave out.
export type IGVReference = ReferenceGenome & {
  ucscID?: string;
  blatDB?: string;
  tracks?: TrackLoad<TrackType>[];
};
