import type { GermlineCNVOccurrence } from '@/api/api';

/** Where the CNV profile opens: on a called CNV, with its panel. */
export type CNVProfileFocus = { kind: 'cnv'; cnvId: string };

export const cnvFocus = (occurrence: Pick<GermlineCNVOccurrence, 'cnv_id'>): CNVProfileFocus => ({
  kind: 'cnv',
  cnvId: occurrence.cnv_id,
});
