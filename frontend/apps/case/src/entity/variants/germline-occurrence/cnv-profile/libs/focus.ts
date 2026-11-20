import type { GermlineCNVOccurrence } from '@/api/api';

export type CNVProfileFocus = { kind: 'cnv'; cnvId: string };

export const cnvFocus = (occurrence: Pick<GermlineCNVOccurrence, 'cnv_id'>): CNVProfileFocus => ({
  kind: 'cnv',
  cnvId: occurrence.cnv_id,
});
