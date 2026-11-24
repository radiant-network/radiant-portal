import type { TFunction } from 'i18next';

import type { VariantSearchHit, VariantSearchResult } from '@/api/api';

// TODO: swap for a generated enum once backend emits one — today the generated client types `status` as string.
export type VariantSearchStatus = 'found' | 'not_found_in_run' | 'unrecognized_format';

export type VariantSearchOutcome =
  | { type: 'found'; values: string[]; normalizedInput: string; hits: VariantSearchHit[] }
  | { type: 'not_found' }
  | { type: 'invalid' };

export function appendHits(current: string[], hits: VariantSearchHit[]): string[] {
  const merged = [...current];
  for (const hit of hits) {
    if (!merged.includes(hit.hgvsg)) {
      merged.push(hit.hgvsg);
    }
  }
  return merged;
}

export function toSearchOutcome(current: string[], result: VariantSearchResult): VariantSearchOutcome {
  const status = result.status as VariantSearchStatus;

  if (status === 'found' && result.variants.length > 0) {
    return {
      type: 'found',
      values: appendHits(current, result.variants),
      normalizedInput: result.normalized_input ?? '',
      hits: result.variants,
    };
  }

  if (status === 'unrecognized_format') {
    return { type: 'invalid' };
  }

  return { type: 'not_found' };
}

export function formatFoundMessage(normalizedInput: string, hits: VariantSearchHit[], t: TFunction): string {
  if (hits.length === 1) {
    const [hit] = hits;
    return t(`common.facets.labels.search_by_hgvsg_message_found_single_${pickFoundContext(hit)}`, {
      normalized_input: normalizedInput,
      hgvsg: hit.hgvsg,
      symbol: hit.symbol ?? '',
      aa_change: hit.aa_change ?? '',
    });
  }

  return t('common.facets.labels.search_by_hgvsg_message_found_multi', {
    count: hits.length,
    hgvsg_list: hits.map(hit => hit.hgvsg).join(', '),
  });
}

function pickFoundContext(hit: VariantSearchHit): 'full' | 'symbol_only' | 'bare' {
  if (hit.symbol && hit.aa_change) return 'full';
  if (hit.symbol) return 'symbol_only';
  return 'bare';
}
