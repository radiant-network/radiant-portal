import { describe, expect, it } from 'vitest';

import type { GeneTrackGene } from '@/api/api';

import { geneDescription } from './gene';

const gene = (description?: string): GeneTrackGene => ({
  gene_id: 'ENSG1',
  symbol: 'G1',
  chromosome: '1',
  start: 0,
  end: 10,
  exons: [],
  description,
});

describe('geneDescription', () => {
  it('drops the source suffix of Ensembl', () => {
    expect(geneDescription(gene('two pore segment channel 2 [Source:HGNC Symbol%3BAcc:HGNC:20820]'))).toBe(
      'two pore segment channel 2',
    );
  });

  it('keeps a description without suffix', () => {
    expect(geneDescription(gene('a gene'))).toBe('a gene');
    expect(geneDescription(gene())).toBeUndefined();
  });
});
