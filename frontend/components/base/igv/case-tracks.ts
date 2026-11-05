import type { Browser, TrackLoad } from 'igv';

import type { IGVTrackEnriched, IGVTracks } from '@/api/api';

export type CaseTrack = TrackLoad<'alignment' | 'variant' | 'wig' | 'annotation'>;

type MemberTrackKind = 'cnv' | 'alignment' | 'seg' | 'baf' | 'roh';

// Display order of the tracks of one member.
const MEMBER_SORTED_TRACK_KINDS: MemberTrackKind[] = ['cnv', 'alignment', 'seg', 'baf', 'roh'];

// The RefSeq gene track of the reference has order 0.
const FIRST_CASE_TRACK_ORDER = 1;

export const CNV_GAIN_COLOR = '#002eff';
export const CNV_LOSS_COLOR = '#ff2101';
export const CNV_OTHER_COLOR = 'gray';

// igv.js passes its own variant object, not the VCFItem of its types; the whole-genome view wraps it in `_f`.
type IGVVariant = { alternateBases?: string; _f?: IGVVariant };

export const getCNVColor = (variant: unknown) => {
  const { alternateBases } = (variant as IGVVariant)._f ?? (variant as IGVVariant);
  if (alternateBases === '<DUP>') return CNV_GAIN_COLOR;
  if (alternateBases === '<DEL>') return CNV_LOSS_COLOR;
  return CNV_OTHER_COLOR;
};

const toCaseTrack = (
  kind: MemberTrackKind | 'capture_targets',
  { name, url = '', indexURL }: IGVTrackEnriched,
  order: number,
): CaseTrack => {
  switch (kind) {
    case 'alignment':
      return { type: 'alignment', format: 'cram', name, url, indexURL, order };
    case 'cnv':
      return { type: 'variant', format: 'vcf', name, url, indexURL, order, color: getCNVColor };
    case 'seg':
    case 'baf':
      return { type: 'wig', format: 'bigWig', name, url, order };
    case 'roh':
    case 'capture_targets':
      return { type: 'annotation', format: 'bed', name, url, order };
  }
};

// The targets track comes first, under the gene track.
export const buildCaseTracks = (igvTracks?: IGVTracks): CaseTrack[] => {
  if (!igvTracks) return [];

  // Every member has Reads, so they carry the member order of the API (proband or tumor first).
  const memberIds = new Set(
    [igvTracks.alignment, ...MEMBER_SORTED_TRACK_KINDS.map(kind => igvTracks[kind])].flatMap(tracks =>
      (tracks ?? []).map(track => track.sequencing_experiment_id),
    ),
  );
  const memberTracks = [...memberIds].flatMap(memberId =>
    MEMBER_SORTED_TRACK_KINDS.flatMap(kind =>
      (igvTracks[kind] ?? [])
        .filter(track => track.sequencing_experiment_id === memberId)
        .map(track => [kind, track] as const),
    ),
  );
  const targetTracks = (igvTracks.capture_targets ?? []).map(track => ['capture_targets', track] as const);

  return [...targetTracks, ...memberTracks].map(([kind, track], index) =>
    toCaseTrack(kind, track, FIRST_CASE_TRACK_ORDER + index),
  );
};

// igv.js adds a track only once it has loaded, so a rejected load leaves nothing to remove.
export const loadCaseTracks = (browser: Pick<Browser, 'loadTrack'>, tracks: CaseTrack[]) => {
  const loads = tracks.map(track => browser.loadTrack(track));
  const failedTrackNames = Promise.allSettled(loads).then(results =>
    results.flatMap((result, index) => {
      const { name } = tracks[index];
      return result.status === 'rejected' && name ? [name] : [];
    }),
  );
  return { loads, failedTrackNames };
};
