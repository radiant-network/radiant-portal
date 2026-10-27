import type { GermlineCNVOccurrence } from '@/api/api';

/** Where the CNV profile opens: on a called CNV, or on a gene with its panel. */
export type CNVProfileFocus = { kind: 'cnv'; cnvId: string } | { kind: 'gene'; symbol: string };

export const cnvFocus = (occurrence: Pick<GermlineCNVOccurrence, 'cnv_id'>): CNVProfileFocus => ({
  kind: 'cnv',
  cnvId: occurrence.cnv_id,
});

/**
 * The focus of the genes of a CNV: its gene when it overlaps a single one, the CNV itself otherwise.
 */
export function genesFocus(occurrence: Pick<GermlineCNVOccurrence, 'cnv_id' | 'symbol'>): CNVProfileFocus {
  const symbols = occurrence.symbol ?? [];
  return symbols.length === 1 ? { kind: 'gene', symbol: symbols[0] } : cnvFocus(occurrence);
}
