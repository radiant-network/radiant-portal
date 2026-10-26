import { describe, expect, it } from 'vitest';

import type { CNVProfileSegment, GeneTrackGene } from '@/api/api';
import type { PlotlyThemeColors } from '@/components/base/charts/hooks/use-plotly-theme';

import { createGenome } from './genome';
import { getCNVProfilePalette } from './palette';
import {
  buildCloudTraces,
  buildCytobandTraces,
  buildGeneTraces,
  buildLayout,
  buildRohTraces,
  buildSegmentTraces,
  cloudMarker,
  segmentValue,
  type TraceLabels,
} from './traces';

const genome = createGenome([
  { name: '1', size: 248_956_422 },
  { name: '2', size: 242_193_529 },
  { name: '3', size: 198_295_559 },
]);
const palette = getCNVProfilePalette(false);
const theme: PlotlyThemeColors = { isDark: false, foreground: '#000', muted: '#666', border: '#ddd', card: '#fff' };
const format = { number: (n: number) => `${n}`, size: (n: number) => `${n} bp` };
const labels = new Proxy({}, { get: (_, key) => String(key) }) as TraceLabels;

const segment = (overrides: Partial<CNVProfileSegment>): CNVProfileSegment => ({
  cnv_id: '1',
  chromosome: '1',
  start: 1000,
  end: 2000,
  type: 'GAIN',
  length: 1000,
  filter: 'PASS',
  sm: 1.5,
  cn: 3,
  ...overrides,
});

describe('buildCloudTraces', () => {
  it('gives one trace per chromosome, in genome coordinates, alternating colours', () => {
    const traces = buildCloudTraces(
      [
        { chromosome: '1', positions: [10, 20], values: [1, 2] },
        { chromosome: '2', positions: [5], values: [0.5] },
        { chromosome: 'Y', positions: [5], values: [0.5] },
      ],
      genome,
      'y',
      'copy ratio',
      palette,
    ) as { x: Float64Array; customdata: number[]; marker: { color: string } }[];

    expect(traces).toHaveLength(2);
    expect(Array.from(traces[1].x)).toEqual([248_956_427]);
    expect(traces[1].customdata).toEqual([5]);
    expect(traces[0].marker.color).toBe(palette.pointEven);
    expect(traces[1].marker.color).toBe(palette.pointOdd);
  });
});

describe('cloudMarker', () => {
  it('draws small points on the whole genome', () => {
    expect(cloudMarker(genome, { x0: 0, x1: genome.length })).toEqual({ size: 2, opacity: 0.55, ringWidth: 0 });
  });

  it('draws big ringed points zoomed in', () => {
    expect(cloudMarker(genome, { x0: 0, x1: 10_000 })).toMatchObject({ size: 7, opacity: 0.85, ringWidth: 1 });
  });
});

describe('segmentValue', () => {
  it('takes the segment mean, capped', () => {
    expect(segmentValue(segment({ sm: 1.4 }))).toBe(1.4);
    expect(segmentValue(segment({ sm: 4 }))).toBe(2.5);
  });

  it('falls back on half the copy number', () => {
    expect(segmentValue(segment({ sm: undefined, cn: 1 }))).toBe(0.5);
  });
});

describe('buildSegmentTraces', () => {
  const segments = [
    segment({}),
    segment({ type: 'LOSS', sm: 0.5 }),
    segment({ filter: 'cnvQual' }),
    segment({ chromosome: 'Y' }),
  ];

  it('groups the CNVs by type and filter status, with a line and a marker trace each', () => {
    const traces = buildSegmentTraces(segments, genome, palette, theme, labels, format, true) as {
      meta: string;
      customdata?: number[];
    }[];
    expect(traces.filter(t => t.meta === 'cnv').map(t => t.customdata)).toEqual([[0], [1], [2]]);
    expect(traces).toHaveLength(6);
  });

  it('leaves out the filtered CNVs on demand', () => {
    const traces = buildSegmentTraces(segments, genome, palette, theme, labels, format, false) as {
      meta: string;
      customdata?: number[];
    }[];
    expect(traces.filter(t => t.meta === 'cnv').map(t => t.customdata)).toEqual([[0], [1]]);
  });
});

describe('buildRohTraces', () => {
  it('draws each region on its chromosome', () => {
    const [line] = buildRohTraces(
      [{ chromosome: '2', start: 100, end: 900, score: 1.5, nb_hom: 60, nb_het: 0 }],
      genome,
      palette,
      theme,
      labels,
      format,
    ) as { x: (number | null)[] }[];
    expect(line.x).toEqual([248_956_522, 248_957_322, null]);
  });
});

describe('buildCytobandTraces', () => {
  const cytobands = [
    { chromosome: '1', cytoband: 'p36.33', start: 0, end: 2_300_000, gie_stain: 'gneg' },
    { chromosome: '2', cytoband: 'p25.3', start: 0, end: 4_400_000, gie_stain: 'gpos50' },
  ];

  it('shows the bands of the chromosomes in view', () => {
    const traces = buildCytobandTraces(cytobands, genome, { x0: 0, x1: 1_000_000 }, 0.001, theme, labels, format);
    const markers = traces.find(t => (t as { meta?: string }).meta === 'cytoband') as { customdata: number[] };
    expect(markers.customdata).toEqual([0]);
  });

  it('shows nothing on the whole genome', () => {
    const traces = buildCytobandTraces(cytobands, genome, { x0: 0, x1: genome.length }, 0.001, theme, labels, format);
    const markers = traces.find(t => (t as { meta?: string }).meta === 'cytoband') as { customdata: number[] };
    expect(markers.customdata).toEqual([]);
  });
});

describe('buildGeneTraces', () => {
  const gene: GeneTrackGene = {
    gene_id: 'ENSG1',
    symbol: 'G1',
    chromosome: '1',
    start: 1000,
    end: 5000,
    strand: '-',
    exons: [
      { start: 1000, end: 1200 },
      { start: 4000, end: 5000 },
    ],
  };

  it('adds the exons below the exon span', () => {
    const traces = buildGeneTraces([gene], genome, { x0: 0, x1: 10_000 }, 0.1, palette, theme, labels, format);
    const markers = traces.find(t => (t as { meta?: string }).meta === 'gene') as { customdata: number[][] };
    expect(markers.customdata).toEqual([
      [0, -1],
      [0, 0],
      [0, 1],
    ]);
  });

  it('draws the gene alone above the exon span', () => {
    const traces = buildGeneTraces([gene], genome, { x0: 0, x1: 10_000_000 }, 0.0001, palette, theme, labels, format);
    const markers = traces.find(t => (t as { meta?: string }).meta === 'gene') as { customdata: number[][] };
    expect(markers.customdata).toEqual([[0, -1]]);
  });

  it('draws the highlighted gene in its own trace', () => {
    const traces = buildGeneTraces(
      [gene],
      genome,
      { x0: 0, x1: 10_000 },
      0.1,
      palette,
      theme,
      labels,
      format,
      'ENSG1',
    ) as {
      x: (number | null)[];
    }[];
    expect(traces[0].x).toEqual([]);
    expect(traces[2].x).toEqual([1000, 5000, null]);
  });
});

describe('buildLayout', () => {
  const layoutLabels = {
    copyRatio: 'cr',
    baf: 'baf',
    roh: 'roh',
    genes: 'genes',
    zoomForGenes: 'g',
    zoomForCytobands: 'c',
  };

  it('hides the top axis and shows the hints on the whole genome', () => {
    const layout = buildLayout(genome, { x0: 0, x1: genome.length }, theme, layoutLabels, false, String);
    expect(layout.xaxis2?.visible).toBe(false);
    expect(layout.annotations?.map(a => a.visible)).toEqual([true, true]);
    expect(layout.xaxis?.ticktext).toEqual(['1', '2', '3']);
  });

  it('shows the top axis on a chromosome', () => {
    const layout = buildLayout(genome, { x0: 0, x1: 1_000_000 }, theme, layoutLabels, true, String);
    expect(layout.xaxis2?.visible).toBe(true);
    expect(layout.annotations?.map(a => a.visible)).toEqual([false, false]);
  });
});
