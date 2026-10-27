import { describe, expect, it } from 'vitest';

import type { CNVProfileSegment, Cytoband, GeneTrackGene } from '@/api/api';

import { createGenome } from './genome';
import { cytobandHitAreas, geneHitAreas, hitTest, locusAt, type PlotFrame, segmentHitAreas } from './hit-test';
import { Y_AXES, type YAxisName } from './traces';

const genome = createGenome([
  { name: '1', size: 248_956_422 },
  { name: '2', size: 242_193_529 },
]);
const frame: PlotFrame = { left: 100, top: 50, width: 1000, height: 1000 };
const view = { x0: 0, x1: 10_000 };

const clientX = (x: number) => frame.left + ((x - view.x0) / (view.x1 - view.x0)) * frame.width;
const clientY = (axis: YAxisName, y: number) => {
  const { domain, range } = Y_AXES[axis];
  const fraction = domain[0] + ((y - range[0]) / (range[1] - range[0])) * (domain[1] - domain[0]);
  return frame.top + (1 - fraction) * frame.height;
};

const segment = (overrides: Partial<CNVProfileSegment>): CNVProfileSegment => ({
  cnv_id: '1',
  chromosome: '1',
  start: 1000,
  end: 5000,
  type: 'GAIN',
  length: 4000,
  has_note: false,
  filter: 'PASS',
  sm: 1.5,
  cn: 3,
  ...overrides,
});

const gene: GeneTrackGene = {
  gene_id: 'ENSG1',
  symbol: 'G1',
  chromosome: '1',
  start: 1000,
  end: 5000,
  strand: '+',
  exons: [
    { start: 1000, end: 1200 },
    { start: 4000, end: 5000 },
  ],
};

describe('segmentHitAreas', () => {
  it('spans each shown CNV at its value', () => {
    const areas = segmentHitAreas([segment({}), segment({ chromosome: '2' })], genome, true);
    expect(areas.map(area => [area.x0, area.x1, area.y0])).toEqual([
      [1000, 5000, 1.5],
      [248_957_422, 248_961_422, 1.5],
    ]);
  });

  it('leaves out the hidden filtered CNVs and the unknown chromosomes', () => {
    const segments = [segment({ filter: 'cnvQual' }), segment({ chromosome: 'Y' })];
    expect(segmentHitAreas(segments, genome, false)).toEqual([]);
  });
});

describe('cytobandHitAreas', () => {
  const bands: Cytoband[] = [
    { chromosome: '1', start: 0, end: 2_300_000, cytoband: 'p36.33', gie_stain: 'gneg' },
    { chromosome: '2', start: 0, end: 4_400_000, cytoband: 'p25.3', gie_stain: 'gneg' },
  ];

  it('keeps the bands of the chromosomes in view', () => {
    expect(cytobandHitAreas(bands, genome, view).map(area => area.target)).toEqual([{ kind: 'cytoband', index: 0 }]);
  });

  it('gives nothing on the whole genome', () => {
    expect(cytobandHitAreas(bands, genome, { x0: 0, x1: genome.length })).toEqual([]);
  });
});

describe('hitTest', () => {
  it('hits a CNV anywhere along its span', () => {
    const areas = segmentHitAreas([segment({})], genome, true);
    expect(hitTest(areas, view, frame, clientX(1200), clientY('y', 1.5) + 4)).toEqual({ kind: 'cnv', index: 0 });
    expect(hitTest(areas, view, frame, clientX(4800), clientY('y', 1.5))).toEqual({ kind: 'cnv', index: 0 });
  });

  it('misses a CNV away from its line', () => {
    const areas = segmentHitAreas([segment({})], genome, true);
    expect(hitTest(areas, view, frame, clientX(3000), clientY('y', 1.5) + 20)).toBeUndefined();
    expect(hitTest(areas, view, frame, clientX(6000), clientY('y', 1.5))).toBeUndefined();
  });

  it('widens a CNV too narrow to aim at', () => {
    const areas = segmentHitAreas([segment({ start: 1000, end: 1001 })], genome, true);
    expect(hitTest(areas, view, frame, clientX(1000) - 3, clientY('y', 1.5))).toEqual({ kind: 'cnv', index: 0 });
  });

  it('prefers the exon to its gene, and takes the gene between exons', () => {
    const areas = geneHitAreas([gene], genome, view, frame.width / (view.x1 - view.x0));
    const y = clientY('y4', 2.25);
    expect(hitTest(areas, view, frame, clientX(4500), y)).toEqual({ kind: 'gene', index: 0, exonIndex: 1 });
    expect(hitTest(areas, view, frame, clientX(3000), y)).toEqual({ kind: 'gene', index: 0 });
  });
});

describe('locusAt', () => {
  const wholeGenome = { x0: 0, x1: genome.length };

  it('gives the chromosome and position under the cursor', () => {
    const x = frame.left + ((248_956_422 + 1000) / genome.length) * frame.width;
    const locus = locusAt(genome, wholeGenome, frame, x, frame.top + 10);
    expect(locus?.chromosome).toBe('2');
    expect(locus?.position).toBeGreaterThan(0);
  });

  it('gives nothing outside the plot area', () => {
    expect(locusAt(genome, wholeGenome, frame, frame.left - 1, frame.top + 10)).toBeUndefined();
    expect(locusAt(genome, wholeGenome, frame, frame.left + 10, frame.top + frame.height + 1)).toBeUndefined();
  });
});
