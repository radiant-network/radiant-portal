import { describe, expect, it } from 'vitest';

import type { CNVProfileSegment, GeneTrackGene } from '@/api/api';

import { cnvsOnGene, exonsHit } from './overlap';

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
});

describe('cnvsOnGene', () => {
  it('keeps the CNVs overlapping the gene on its chromosome', () => {
    const segments = [segment('1', 0, 1001), segment('1', 5000, 6000), segment('2', 1000, 5000)];
    expect(cnvsOnGene(segments, gene).map(s => s.cnv_id)).toEqual(['1-0']);
  });
});

describe('exonsHit', () => {
  it('counts the exons a CNV overlaps', () => {
    expect(exonsHit(gene, segment('1', 2900, 4900))).toBe(2);
  });

  it('gives zero for an intronic CNV', () => {
    expect(exonsHit(gene, segment('1', 1300, 2900))).toBe(0);
  });
});
