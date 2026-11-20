import { describe, expect, it } from 'vitest';

import type { CNVProfileSegment, GeneTrackGene } from '@/api/api';

import { cnvsOnGene } from './overlap';

const gene: GeneTrackGene = {
  gene_id: 'ENSG1',
  symbol: 'G1',
  chromosome: '1',
  start: 1000,
  end: 5000,
  exons: [
    { start: 1000, end: 1200 },
    { start: 3000, end: 3100 },
    { start: 4800, end: 5000 },
  ],
};

const segment = (chromosome: string, start: number, end: number): CNVProfileSegment => ({
  cnv_id: `${chromosome}-${start}`,
  chromosome,
  start,
  end,
  type: 'LOSS',
  length: end - start,
  has_note: false,
});

describe('cnvsOnGene', () => {
  it('keeps the CNVs overlapping the gene on its chromosome, bounds included', () => {
    const segments = [
      segment('1', 0, 999),
      segment('1', 500, 1000),
      segment('1', 5000, 6000),
      segment('2', 1000, 5000),
    ];
    expect(cnvsOnGene(segments, gene).map(s => s.cnv_id)).toEqual(['1-500', '1-5000']);
  });
});
