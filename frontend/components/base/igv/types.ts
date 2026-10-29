import type { ReferenceGenome } from 'igv';

import type { IGVTrackEnriched } from '@/api/api';

// igv.js track config. API case tracks (IGVTrackEnriched) fit it as is; tracks built here, such as
// the reference gene track, set only the igv.js fields and none of the API ones.
export type IGVTrack = Partial<IGVTrackEnriched> & {
  /**
   * Integer value specifying relative order of track position on the screen. To pin a track to the bottom use Number.MAX_VALUE. If no order is specified, tracks appear in order of their addition.
   */
  order?: number;
  /**
   * Maximum window size in base pairs for which indexed annotations or variants are displayed  1 MB for variants, 30 KB for alignments, whole chromosome for other track types
   */
  visibilityWindow?: number;
  /**
   * CSS color value for track features, e.g. "#ff0000" or "rgb(100,0,100)"
   */
  color?: string;
  /**
   * Annotation display mode, one of "COLLAPSED", "EXPANDED", "SQUISHED"  "COLLAPSED"
   * @default COLLAPSED
   */
  displayMode?: 'COLLAPSED' | 'EXPANDED' | 'SQUISHED';
  /**
   * Initial height of track viewport in pixels
   * @default 50
   */
  height?: number;
  /**
   * If true, then track height is adjusted dynamically, within the bounds set by minHeight and maxHeight, to accomdodate features in view
   * @default true;
   */
  autoHeight?: boolean;
  /**
   * Minimum height of track in pixels  50
   * @default 50
   */
  minHeight?: number;
  /**
   * Maximum height of track in pixels
   * @default 500
   */
  maxHeight?: number;
};

// igv.js reads these reference fields, which its types leave out.
export type IGVReference = ReferenceGenome & {
  ucscID?: string;
  blatDB?: string;
  tracks?: IGVTrack[];
};
