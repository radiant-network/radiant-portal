import type { Browser, TrackLoad, Tracks } from 'igv';

import type { IGVPublicTrack } from '@/api/api';

import { CNV_GAIN_COLOR, CNV_LOSS_COLOR, CNV_OTHER_COLOR } from './case-tracks';
import type { IGVContext } from './types';

export type PublicTrackId =
  | 'clinvar'
  | 'dgv'
  | 'clinvar_sv'
  | 'clingen_region_haploinsufficiency'
  | 'clingen_region_triplosensitivity'
  | 'gnomad_sv'
  | 'gnomad_cnv'
  | 'clingen_gene_haploinsufficiency'
  | 'clingen_gene_triplosensitivity'
  | 'segmental_duplications'
  | 'repeat_masker'
  | 'simple_repeats'
  | 'self_chain';

export type PublicTrack = TrackLoad<'variant' | 'annotation'> & { id: PublicTrackId; name: string };

export type PublicTrackOption = { track: PublicTrack; shownByDefault: boolean };

type PublicTrackDisplay =
  | { type: 'variant'; format: 'vcf' }
  | ({ type: 'annotation'; format: 'gff3' } & Pick<Tracks.AnnotationTrackCommonOptions, 'colorBy' | 'colorTable'>);

type PublicTrackEntry = {
  id: PublicTrackId;
  fileId: string;
  context: IGVContext;
  shownByDefault: boolean;
  display: PublicTrackDisplay;
};

// Below the case tracks, whose order is their index from 1.
const FIRST_PUBLIC_TRACK_ORDER = 1000;

const OTHER_VALUE_COLOR = 'grey';

const CLINGEN_GENE_COLORS = {
  Sufficient_evidence_for_dosage_pathogenicity: 'green',
  Some_evidence_for_dosage_pathogenicity: 'lightgreen',
  Little_evidence_for_dosage_pathogenicity: 'salmon',
  Gene_associated_with_autosomal_recessive_phenotype: 'lightblue',
  Dosage_sensitivity_unlikely: 'red',
  No_evidence_available: OTHER_VALUE_COLOR,
  '*': OTHER_VALUE_COLOR,
};

const CLINGEN_REGION_COLORS = {
  Sufficient_evidence_for_dosage_pathogenicity: 'red',
  Some_evidence_for_dosage_pathogenicity: 'orange',
  Little_evidence_for_dosage_pathogenicity: 'gold',
  Gene_associated_with_autosomal_recessive_phenotype: 'purple',
  Dosage_sensitivity_unlikely: 'green',
  No_evidence_available: OTHER_VALUE_COLOR,
  '*': OTHER_VALUE_COLOR,
};

const VCF: PublicTrackDisplay = { type: 'variant', format: 'vcf' };
const GFF3: PublicTrackDisplay = { type: 'annotation', format: 'gff3' };

const gff3ColoredBy = (colorBy: string, colorTable: Record<string, string>): PublicTrackDisplay => ({
  ...GFF3,
  colorBy,
  colorTable,
});

// In menu order. The ClinGen gene and region files each give two tracks.
const PUBLIC_TRACK_ENTRIES: PublicTrackEntry[] = [
  { id: 'clinvar', fileId: 'clinvar', context: 'snv', shownByDefault: false, display: VCF },
  {
    id: 'dgv',
    fileId: 'dgv',
    context: 'cnv',
    shownByDefault: true,
    display: gff3ColoredBy('variant_sub_type', { Gain: CNV_GAIN_COLOR, Loss: CNV_LOSS_COLOR, '*': CNV_OTHER_COLOR }),
  },
  { id: 'clinvar_sv', fileId: 'clinvar_sv', context: 'cnv', shownByDefault: true, display: VCF },
  {
    id: 'clingen_region_haploinsufficiency',
    fileId: 'clingen_region',
    context: 'cnv',
    shownByDefault: true,
    display: gff3ColoredBy('haploinsufficiency_description', CLINGEN_REGION_COLORS),
  },
  {
    id: 'clingen_region_triplosensitivity',
    fileId: 'clingen_region',
    context: 'cnv',
    shownByDefault: true,
    display: gff3ColoredBy('triplosensitivity_description', CLINGEN_REGION_COLORS),
  },
  { id: 'gnomad_sv', fileId: 'gnomad_sv', context: 'cnv', shownByDefault: false, display: VCF },
  { id: 'gnomad_cnv', fileId: 'gnomad_cnv', context: 'cnv', shownByDefault: false, display: VCF },
  {
    id: 'clingen_gene_haploinsufficiency',
    fileId: 'clingen_gene',
    context: 'cnv',
    shownByDefault: false,
    display: gff3ColoredBy('haploinsufficiency_description', CLINGEN_GENE_COLORS),
  },
  {
    id: 'clingen_gene_triplosensitivity',
    fileId: 'clingen_gene',
    context: 'cnv',
    shownByDefault: false,
    display: gff3ColoredBy('triplosensitivity_description', CLINGEN_GENE_COLORS),
  },
  {
    id: 'segmental_duplications',
    fileId: 'segmental_duplications',
    context: 'cnv',
    shownByDefault: false,
    display: GFF3,
  },
  { id: 'repeat_masker', fileId: 'repeat_masker', context: 'cnv', shownByDefault: false, display: GFF3 },
  { id: 'simple_repeats', fileId: 'simple_repeats', context: 'cnv', shownByDefault: false, display: GFF3 },
  { id: 'self_chain', fileId: 'self_chain', context: 'cnv', shownByDefault: false, display: GFF3 },
];

// An entry whose file is missing from the IGV response is not offered.
export const buildPublicTracks = (
  context: IGVContext,
  publicTracks: Record<string, IGVPublicTrack> | undefined,
  getName: (id: PublicTrackId) => string,
): PublicTrackOption[] =>
  PUBLIC_TRACK_ENTRIES.filter(entry => entry.context === context && publicTracks?.[entry.fileId]).map(
    ({ id, fileId, shownByDefault, display }, index) => {
      const { url, indexURL } = (publicTracks ?? {})[fileId];
      const track: PublicTrack = {
        ...display,
        id,
        name: getName(id),
        url,
        indexURL,
        order: FIRST_PUBLIC_TRACK_ORDER + index,
        displayMode: 'EXPANDED',
      };
      return { track, shownByDefault };
    },
  );

type PublicTrackLoad = { wanted: boolean; track?: Tracks.Track };

// One load per track id at a time: a track switched off while it loads is removed once loaded, and
// switched back on in the meantime it simply stays.
export const createPublicTrackLoader = (
  browser: Pick<Browser, 'loadTrack' | 'removeTrack'>,
  onFailed: (trackName: string) => void,
) => {
  const loads = new Map<PublicTrackId, PublicTrackLoad>();

  const show = (track: PublicTrack) => {
    const load: PublicTrackLoad = { wanted: true };
    loads.set(track.id, load);
    return browser.loadTrack(track).then(
      loaded => {
        load.track = loaded as Tracks.Track;
        if (load.wanted) return;
        loads.delete(track.id);
        browser.removeTrack(load.track);
      },
      () => {
        loads.delete(track.id);
        if (load.wanted) onFailed(track.name);
      },
    );
  };

  const sync = (tracks: PublicTrack[]) => {
    const shownIds = new Set(tracks.map(track => track.id));
    loads.forEach((load, id) => {
      if (shownIds.has(id)) return;
      load.wanted = false;
      if (!load.track) return;
      loads.delete(id);
      browser.removeTrack(load.track);
    });
    return Promise.all(
      tracks.flatMap(track => {
        const load = loads.get(track.id);
        if (!load) return [show(track)];
        load.wanted = true;
        return [];
      }),
    );
  };

  // A track removed from its igv.js menu, not from ours: returns its id so the menu unchecks it.
  const forget = (removed: Tracks.Track) => {
    for (const [id, load] of loads) {
      if (load.track === removed) {
        loads.delete(id);
        return id;
      }
    }
    return undefined;
  };

  return { sync, forget };
};
