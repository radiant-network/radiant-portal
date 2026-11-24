import type { TFunction } from 'i18next';
import { describe, expect, it } from 'vitest';

import type { VariantSearchHit, VariantSearchResult } from '@/api/api';

import { appendHits, formatFoundMessage, toSearchOutcome } from './search-by-variant-facet.mapping';

function hit(
  hgvsg: string,
  extras: Partial<Omit<VariantSearchHit, 'hgvsg' | 'locus' | 'locus_id'>> = {},
): VariantSearchHit {
  return { hgvsg, locus: '1-1-A-T', locus_id: `locus-${hgvsg}`, ...extras };
}

function result(status: string, variants: VariantSearchHit[] = []): VariantSearchResult {
  return { status, variants, normalized_input: 'rs334' };
}

const t = ((key: string, values?: Record<string, unknown>) =>
  `${key}:${JSON.stringify(values ?? {})}`) as unknown as TFunction;

describe('appendHits', () => {
  it('returns the hgvsg of a single hit when current is empty', () => {
    expect(appendHits([], [hit('chr1:g.100A>T')])).toEqual(['chr1:g.100A>T']);
  });

  it('appends a new hit at the end of existing values', () => {
    expect(appendHits(['chr1:g.100A>T'], [hit('chr2:g.200C>G')])).toEqual(['chr1:g.100A>T', 'chr2:g.200C>G']);
  });

  it('does not duplicate a hit already in current', () => {
    expect(appendHits(['chr1:g.100A>T'], [hit('chr1:g.100A>T')])).toEqual(['chr1:g.100A>T']);
  });

  it('appends multiple hits, preserves order and dedups across hits + current', () => {
    const current = ['chr1:g.100A>T'];
    const hits = [hit('chr2:g.200C>G'), hit('chr1:g.100A>T'), hit('chr3:g.300G>A')];
    expect(appendHits(current, hits)).toEqual(['chr1:g.100A>T', 'chr2:g.200C>G', 'chr3:g.300G>A']);
  });

  it('dedups duplicates within the hits array itself', () => {
    expect(appendHits([], [hit('chr1:g.100A>T'), hit('chr1:g.100A>T')])).toEqual(['chr1:g.100A>T']);
  });
});

describe('toSearchOutcome', () => {
  it('returns the merged pill values and the hits when found', () => {
    const hits = [hit('chr11:g.5227002T>A'), hit('chr11:g.5227002T>G')];
    expect(toSearchOutcome(['chr1:g.100A>T'], result('found', hits))).toEqual({
      type: 'found',
      values: ['chr1:g.100A>T', 'chr11:g.5227002T>A', 'chr11:g.5227002T>G'],
      normalizedInput: 'rs334',
      hits,
    });
  });

  it('returns not_found when found carries no variant', () => {
    expect(toSearchOutcome([], result('found', []))).toEqual({ type: 'not_found' });
  });

  it('returns not_found for not_found_in_run', () => {
    expect(toSearchOutcome(['chr1:g.100A>T'], result('not_found_in_run'))).toEqual({ type: 'not_found' });
  });

  it('returns invalid for unrecognized_format', () => {
    expect(toSearchOutcome([], result('unrecognized_format'))).toEqual({ type: 'invalid' });
  });
});

describe('formatFoundMessage', () => {
  it('picks the _full key when both symbol and aa_change are set', () => {
    const hits = [hit('chr11:g.5227002T>A', { symbol: 'HBB', aa_change: 'p.Glu7Val' })];
    expect(formatFoundMessage('rs334', hits, t)).toBe(
      `common.facets.labels.search_by_hgvsg_message_found_single_full:${JSON.stringify({
        normalized_input: 'rs334',
        hgvsg: 'chr11:g.5227002T>A',
        symbol: 'HBB',
        aa_change: 'p.Glu7Val',
      })}`,
    );
  });

  it('picks the _symbol_only key when aa_change is missing', () => {
    const hits = [hit('chr11:g.5227002T>A', { symbol: 'HBB' })];
    expect(formatFoundMessage('rs334', hits, t)).toContain('search_by_hgvsg_message_found_single_symbol_only');
  });

  it('picks the _bare key when both symbol and aa_change are missing', () => {
    expect(formatFoundMessage('rs334', [hit('chr11:g.5227002T>A')], t)).toContain(
      'search_by_hgvsg_message_found_single_bare',
    );
  });

  it('formats the multi-hit message with count and comma-separated hgvsg list', () => {
    const hits = [hit('chr11:g.5227002T>A'), hit('chr11:g.5227002T>G')];
    expect(formatFoundMessage('rs334', hits, t)).toBe(
      `common.facets.labels.search_by_hgvsg_message_found_multi:${JSON.stringify({
        count: 2,
        hgvsg_list: 'chr11:g.5227002T>A, chr11:g.5227002T>G',
      })}`,
    );
  });
});
