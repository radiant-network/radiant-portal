import type { Data, Layout } from 'plotly.js';

import type { CNVProfileROH, CNVProfileSegment, CNVProfileTrack, Cytoband, GeneTrackGene } from '@/api/api';
import type { PlotlyThemeColors } from '@/components/base/charts/hooks/use-plotly-theme';

import { NOTE_ITEM } from '../../../filters/annotation-filter-items';

import { assignLanes, GENE_LANES } from './gene-lanes';
import { chromosomeIndexAt, chromosomesInView, computeTicks, type Genome, type GenomeView } from './genome';
import { type CNVProfilePalette, CYTOBAND_STAINS } from './palette';

export const GENE_TRACK_MAX_SPAN = 20_000_000;
export const EXON_MAX_SPAN = 2_000_000;
const CYTOBAND_MAX_SPAN = 300_000_000;
const CYTOBAND_HOVER_SIZE = 16;
const SEGMENT_MAX_VALUE = 2.5;

export const PLOT_MARGIN = { l: 64, r: 16, t: 30, b: 40 };

export type YAxisName = 'y' | 'y2' | 'y3' | 'y4' | 'y5';

/**
 * Where each track sits, in paper fraction, and the values it spans: copy ratio, BAF, ROH, genes and
 * cytobands.
 */
export const Y_AXES: Record<YAxisName, { domain: [number, number]; range: [number, number] }> = {
  y: { domain: [0.52, 0.9], range: [-0.12, 2.8] },
  y2: { domain: [0.275, 0.48], range: [-0.07, 1.07] },
  y3: { domain: [0.2, 0.24], range: [0, 1] },
  y4: { domain: [0, 0.16], range: [0, GENE_LANES] },
  y5: { domain: [0.935, 1], range: [0, 1.3] },
};

// The data tracks sit on a tinted panel each, so that the gaps between them read as separators.
const PANEL_AXES: YAxisName[] = ['y', 'y2', 'y3'];
const PANEL_OPACITY = 0.35;

export type TraceKind = 'cloud' | 'cnv' | 'roh' | 'cytoband' | 'decoration';

export type Formatters = {
  number: (value: number) => string;
  size: (bases: number) => string;
};

export type TraceLabels = {
  copyRatio: string;
  baf: string;
  clickToZoom: string;
  roh: string;
  homozygous: string;
  heterozygous: string;
  score: string;
};

type Trace = Data & { meta?: TraceKind };

const lineTrace = (yaxis: string, color: string, width: number, extra: object = {}): Trace =>
  ({
    type: 'scattergl',
    mode: 'lines',
    x: [],
    y: [],
    yaxis,
    hoverinfo: 'skip',
    showlegend: false,
    meta: 'decoration',
    line: { color, width },
    ...extra,
  }) as Trace;

const pushSpan = (trace: { x: (number | null)[]; y: (number | null)[] }, x0: number, x1: number, y: number) => {
  trace.x.push(x0, x1, null);
  trace.y.push(y, y, null);
};

export const isChromosomeLevel = (genome: Genome, view: GenomeView) =>
  chromosomesInView(genome, view).length <= 2 && view.x1 - view.x0 < CYTOBAND_MAX_SPAN;

export type OutOfScale = { above: number; drawnAt: number };

/**
 * The copy ratios above 2.6 are drawn as triangles on a line of their own, at the top of the track and
 * above the called CNVs, which stop at SEGMENT_MAX_VALUE.
 */
export const COPY_RATIO_OUT_OF_SCALE: OutOfScale = { above: 2.6, drawnAt: 2.7 };

/** How much bigger than the cloud points the out-of-scale triangles are drawn, in pixels. */
export const OUT_OF_SCALE_SIZE_BOOST = 4;

/**
 * One trace per chromosome, coloured by parity so that neighbours alternate, like the DRAGEN plot.
 * Out of scale, the points go in a second trace of triangles, which keeps their value for the hover.
 */
export function buildCloudTraces(
  tracks: CNVProfileTrack[],
  genome: Genome,
  yaxis: 'y' | 'y2',
  name: string,
  palette: CNVProfilePalette,
  outOfScale: OutOfScale = { above: Infinity, drawnAt: Infinity },
): Trace[] {
  return tracks.flatMap(track => {
    const chromosome = genome.byName.get(track.chromosome);
    if (!chromosome) return [];
    const odd = chromosomeIndexAt(genome, chromosome.offset) % 2 === 1;
    const inScale: number[] = [];
    const above: number[] = [];
    track.values.forEach((value, index) => (value > outOfScale.above ? above : inScale).push(index));
    const cloud = (indexes: number[], extra: object) =>
      ({
        type: 'scattergl',
        mode: 'markers',
        name,
        yaxis,
        showlegend: false,
        meta: 'cloud',
        x: Float64Array.from(indexes, index => chromosome.offset + track.positions[index]),
        marker: {
          size: 2,
          opacity: 0.55,
          color: odd ? palette.pointOdd : palette.pointEven,
          line: { width: 0, color: odd ? palette.pointOddRing : palette.pointEvenRing },
        },
        ...extra,
      }) as Trace;
    const traces = [
      cloud(inScale, {
        y: Float32Array.from(inScale, index => track.values[index]),
        customdata: inScale.map(index => track.positions[index]),
        hovertemplate: `${chromosome.name}:%{customdata:,}<br>${name} %{y:.3f}<extra></extra>`,
      }),
    ];
    if (above.length > 0) {
      const triangles = cloud(above, {
        y: Float32Array.from(above, () => outOfScale.drawnAt),
        customdata: above.map(index => [track.positions[index], track.values[index]]),
        hovertemplate: `${chromosome.name}:%{customdata[0]:,}<br>${name} %{customdata[1]:.3f}<extra></extra>`,
      }) as Trace & { marker: object };
      triangles.marker = { ...triangles.marker, symbol: 'triangle-up' };
      traces.push(triangles);
    }
    return traces;
  });
}

export const cloudMarker = (genome: Genome, view: GenomeView) => {
  const zoom = Math.log10(genome.length / Math.max(1, view.x1 - view.x0));
  const size = Math.min(7, 2 + 1.3 * zoom);
  return { size, opacity: Math.min(0.85, 0.55 + 0.08 * zoom), ringWidth: size >= 4 ? 1 : 0 };
};

export const segmentValue = (segment: CNVProfileSegment) =>
  Math.min(segment.sm ?? (segment.cn ?? 2) / 2, SEGMENT_MAX_VALUE);

export const isFiltered = (segment: CNVProfileSegment) => segment.filter !== undefined && segment.filter !== 'PASS';

/**
 * Whether a CNV passes the annotation quick filters of the CNV table: with no filter, every CNV does;
 * otherwise a CNV with comments when the note item is on, or flagged with one of the flag types.
 */
export function matchesAnnotations(segment: CNVProfileSegment, annotations: string[]): boolean {
  if (annotations.length === 0) return true;
  return (
    (annotations.includes(NOTE_ITEM) && segment.has_note) ||
    (segment.flag_type !== undefined && annotations.includes(segment.flag_type))
  );
}

export const isSegmentShown = (
  segment: CNVProfileSegment,
  genome: Genome,
  showFiltered: boolean,
  annotations: string[] = [],
) =>
  genome.byName.has(segment.chromosome) &&
  (showFiltered || !isFiltered(segment)) &&
  matchesAnnotations(segment, annotations);

/**
 * A line per called CNV over its span and a marker at its middle, grouped by type and filter status.
 * The chart shows their tooltip and handles their click on the whole span. customdata holds the
 * segment index.
 */
export function buildSegmentTraces(
  segments: CNVProfileSegment[],
  genome: Genome,
  palette: CNVProfilePalette,
  theme: PlotlyThemeColors,
  showFiltered: boolean,
  annotations: string[] = [],
): Trace[] {
  const groups = new Map<string, number[]>();
  segments.forEach((segment, index) => {
    if (!isSegmentShown(segment, genome, showFiltered, annotations)) return;
    const key = `${segment.type === 'GAIN' ? 'gain' : 'loss'}-${isFiltered(segment)}`;
    groups.set(key, [...(groups.get(key) ?? []), index]);
  });

  return [...groups.entries()].flatMap(([key, indexes]) => {
    const gain = key.startsWith('gain');
    const filtered = key.endsWith('true');
    const color = gain ? palette.gain : palette.loss;
    const line = lineTrace('y', color, 4, { line: { color, width: 4, dash: filtered ? 'dot' : 'solid' } });
    const markers = { x: [] as number[], y: [] as number[] };
    for (const index of indexes) {
      const segment = segments[index];
      const offset = genome.byName.get(segment.chromosome)!.offset;
      const y = segmentValue(segment);
      pushSpan(line as { x: number[]; y: number[] }, offset + segment.start, offset + segment.end, y);
      markers.x.push(offset + (segment.start + segment.end) / 2);
      markers.y.push(y);
    }
    return [
      line,
      {
        type: 'scattergl',
        mode: 'markers',
        yaxis: 'y',
        showlegend: false,
        meta: 'cnv',
        ...markers,
        customdata: indexes,
        hoverinfo: 'skip',
        marker: {
          size: 11,
          color: filtered ? theme.card : color,
          line: { color: filtered ? color : theme.card, width: 2.5 },
        },
      } as Trace,
    ];
  });
}

export function buildRohTraces(
  regions: CNVProfileROH[],
  genome: Genome,
  palette: CNVProfilePalette,
  theme: PlotlyThemeColors,
  labels: TraceLabels,
  format: Formatters,
): Trace[] {
  const line = lineTrace('y3', palette.roh, 10) as Trace & { x: number[]; y: number[] };
  const markers = { x: [] as number[], y: [] as number[], text: [] as string[] };
  for (const region of regions) {
    const chromosome = genome.byName.get(region.chromosome);
    if (!chromosome) continue;
    pushSpan(line, chromosome.offset + region.start, chromosome.offset + region.end, 0.5);
    markers.x.push(chromosome.offset + (region.start + region.end) / 2);
    markers.y.push(0.5);
    markers.text.push(
      [
        `<b>${labels.roh} ${region.chromosome}:${format.number(region.start)}-${format.number(region.end)}</b>`,
        `${format.size(region.end - region.start)} · ${labels.score} ${region.score}`,
        `${region.nb_hom} ${labels.homozygous} · ${region.nb_het} ${labels.heterozygous}`,
      ].join('<br>'),
    );
  }
  return [
    line,
    {
      type: 'scattergl',
      mode: 'markers',
      yaxis: 'y3',
      showlegend: false,
      meta: 'roh',
      ...markers,
      hovertemplate: '%{text}<extra></extra>',
      marker: { size: 8, color: palette.roh, line: { color: theme.card, width: 2 } },
    } as Trace,
  ];
}

/**
 * The ideogram of the chromosomes in view, at every zoom: an outline, one line per stain, a hover
 * marker per band (customdata: band index) and the names that fit. On the whole genome, it shows that
 * the gaps of the copy ratio and the BAF are centromeres, heterochromatin or acrocentric arms.
 */
export function buildCytobandTraces(
  cytobands: Cytoband[],
  genome: Genome,
  view: GenomeView,
  pxPerBase: number,
  theme: PlotlyThemeColors,
  labels: TraceLabels,
  format: Formatters,
): Trace[] {
  const stains = Object.keys(CYTOBAND_STAINS);
  const axes = { xaxis: 'x2', yaxis: 'y5' };
  const outline = lineTrace('y5', theme.muted, 16, { xaxis: 'x2' }) as Trace & { x: number[]; y: number[] };
  const lines = stains.map(
    stain => lineTrace('y5', CYTOBAND_STAINS[stain], 13, { xaxis: 'x2' }) as Trace & { x: number[]; y: number[] },
  );
  const markers = {
    x: [] as number[],
    y: [] as number[],
    text: [] as string[],
    customdata: [] as number[],
    size: [] as number[],
  };
  const names = { x: [] as number[], y: [] as number[], text: [] as string[] };

  for (const chromosome of chromosomesInView(genome, view)) {
    pushSpan(outline, chromosome.offset, chromosome.offset + chromosome.size, 0.35);
  }
  cytobands.forEach((band, index) => {
    const chromosome = genome.byName.get(band.chromosome);
    if (!chromosome) return;
    const g0 = chromosome.offset + band.start;
    const g1 = chromosome.offset + band.end;
    if (g1 < view.x0 || g0 > view.x1) return;
    pushSpan(lines[Math.max(0, stains.indexOf(band.gie_stain ?? 'gneg'))], g0, g1, 0.35);
    const middle = (Math.max(g0, view.x0) + Math.min(g1, view.x1)) / 2;
    const widthPx = (Math.min(g1, view.x1) - Math.max(g0, view.x0)) * pxPerBase;
    markers.x.push(middle);
    markers.y.push(0.35);
    markers.customdata.push(index);
    // Plotly ties the markers under the cursor: each one is as wide as its band, so that the hover
    // gets the band under the cursor on the whole genome too.
    markers.size.push(Math.min(CYTOBAND_HOVER_SIZE, Math.max(2, widthPx)));
    markers.text.push(
      [
        `<b>${band.chromosome}${band.cytoband}</b> (${band.gie_stain ?? '-'})`,
        `${band.chromosome}:${format.number(band.start + 1)}-${format.number(band.end)} · ${format.size(band.end - band.start)}`,
        `<i>${labels.clickToZoom}</i>`,
      ].join('<br>'),
    );
    if (widthPx > band.cytoband.length * 6.5 + 8) {
      names.x.push(middle);
      names.y.push(1.05);
      names.text.push(band.cytoband);
    }
  });

  return [
    outline,
    ...lines,
    {
      type: 'scatter',
      mode: 'markers',
      ...axes,
      showlegend: false,
      meta: 'cytoband',
      x: markers.x,
      y: markers.y,
      text: markers.text,
      customdata: markers.customdata,
      hovertemplate: '%{text}<extra></extra>',
      marker: { size: markers.size, color: 'rgba(0,0,0,0)' },
    } as Trace,
    {
      type: 'scatter',
      mode: 'text',
      ...axes,
      showlegend: false,
      hoverinfo: 'skip',
      meta: 'decoration',
      ...names,
      textposition: 'middle center',
      textfont: { size: 10, color: theme.muted },
    } as Trace,
  ];
}

export const strandLabel = (gene: GeneTrackGene) => (gene.strand === '-' ? `‹ ${gene.symbol}` : `${gene.symbol} ›`);

export const PROTEIN_CODING = 'protein_coding';

export const isExonView = (view: GenomeView) => view.x1 - view.x0 <= EXON_MAX_SPAN;

export type PlacedGene = {
  gene: GeneTrackGene;
  index: number;
  start: number;
  end: number;
  offset: number;
  y: number;
  labelled: boolean;
};

/**
 * Places the genes in genome coordinates and in their lane, the protein-coding ones first.
 */
export function placeGenes(genes: GeneTrackGene[], genome: Genome, pxPerBase: number): PlacedGene[] {
  const items = genes.flatMap((gene, index) => {
    const chromosome = genome.byName.get(gene.chromosome);
    if (!chromosome) return [];
    return [
      {
        gene,
        index,
        start: chromosome.offset + gene.start,
        end: chromosome.offset + gene.end,
        offset: chromosome.offset,
        label: strandLabel(gene),
        primary: gene.biotype === PROTEIN_CODING,
      },
    ];
  });
  const lanes = assignLanes(items, pxPerBase);
  return items.map(({ gene, index, start, end, offset }, k) => ({
    gene,
    index,
    start,
    end,
    offset,
    y: GENE_LANES - 1 - lanes[k].lane + 0.25,
    labelled: lanes[k].labelled,
  }));
}

/**
 * Genes packed in lanes, as a bar, or below EXON_MAX_SPAN as exon blocks on an intron line. The
 * protein-coding genes get their labels first; the other biotypes are drawn paler and the
 * highlighted gene in its own colour. The chart shows their tooltip and handles their click.
 */
export function buildGeneTraces(
  genes: GeneTrackGene[],
  genome: Genome,
  view: GenomeView,
  pxPerBase: number,
  palette: CNVProfilePalette,
  theme: PlotlyThemeColors,
  highlightedGeneId?: string,
): Trace[] {
  const detailed = isExonView(view);
  const bars = [
    lineTrace('y4', palette.gene, detailed ? 2 : 8),
    lineTrace('y4', palette.gene, 12),
    lineTrace('y4', palette.highlight, detailed ? 3 : 10),
    lineTrace('y4', palette.highlight, 14),
    lineTrace('y4', palette.geneOther, detailed ? 2 : 8),
    lineTrace('y4', palette.geneOther, 12),
  ] as (Trace & { x: number[]; y: number[] })[];
  const names = { x: [] as number[], y: [] as number[], text: [] as string[] };

  placeGenes(genes, genome, pxPerBase).forEach(({ gene, start, end, offset, y, labelled }) => {
    const highlighted = gene.gene_id === highlightedGeneId;
    let style = gene.biotype === PROTEIN_CODING ? 0 : 4;
    if (highlighted) style = 2;
    pushSpan(bars[style], start, end, y);
    if (detailed) {
      gene.exons.forEach(exon => pushSpan(bars[style + 1], offset + exon.start, offset + exon.end, y));
    }
    if (labelled) {
      names.x.push((start + end) / 2);
      names.y.push(y + 0.42);
      names.text.push(strandLabel(gene));
    }
  });

  return [
    ...bars,
    {
      type: 'scatter',
      mode: 'text',
      yaxis: 'y4',
      showlegend: false,
      hoverinfo: 'skip',
      meta: 'decoration',
      ...names,
      textposition: 'middle center',
      textfont: { size: 12, color: theme.foreground },
    } as Trace,
  ];
}

export type LayoutLabels = {
  copyRatio: string;
  baf: string;
  roh: string;
  genes: string;
  zoomForGenes: string;
};

export function buildLayout(
  genome: Genome,
  view: GenomeView,
  theme: PlotlyThemeColors,
  labels: LayoutLabels,
  showGenes: boolean,
  formatPosition: (bases: number) => string,
): Partial<Layout> {
  const ticks = computeTicks(genome, view, formatPosition);
  const chromosomeLevel = isChromosomeLevel(genome, view);
  const yAxis = (name: YAxisName, title: string, extra: object) => ({
    domain: Y_AXES[name].domain,
    fixedrange: true,
    title: { text: title, font: { size: 12, color: theme.muted } },
    gridcolor: theme.border,
    zeroline: false,
    tickfont: { color: theme.muted, size: 11 },
    ...extra,
  });
  const hiddenYAxis = (name: YAxisName, title: string) =>
    yAxis(name, title, { range: Y_AXES[name].range, showticklabels: false, showgrid: false });
  const xAxis = {
    tickvals: ticks.tickvals,
    ticktext: ticks.ticktext,
    tickfont: { color: theme.muted, size: 11 },
    tickangle: 0,
    zeroline: false,
  };

  return {
    paper_bgcolor: theme.card,
    plot_bgcolor: theme.card,
    margin: PLOT_MARGIN,
    hovermode: 'closest',
    showlegend: false,
    hoverlabel: { bgcolor: theme.card, bordercolor: theme.border, font: { color: theme.foreground } },
    xaxis: {
      ...xAxis,
      range: [view.x0, view.x1],
      anchor: 'y4',
      showgrid: chromosomesInView(genome, view).length < 3,
      gridcolor: theme.border,
    },
    xaxis2: { ...xAxis, matches: 'x', anchor: 'y5', side: 'top', visible: chromosomeLevel, showgrid: false },
    yaxis5: hiddenYAxis('y5', ''),
    yaxis: yAxis('y', labels.copyRatio, {
      range: Y_AXES.y.range,
      tickvals: [0, 0.5, 1, 1.5, 2, 2.5],
      minor: { tickvals: [0.25, 0.75, 1.25, 1.75, 2.25], showgrid: true, gridcolor: theme.border, griddash: 'dot' },
    }),
    yaxis2: yAxis('y2', labels.baf, { range: Y_AXES.y2.range, tickvals: [0, 0.25, 0.5, 0.75, 1] }),
    yaxis3: hiddenYAxis('y3', labels.roh),
    yaxis4: hiddenYAxis('y4', labels.genes),
    shapes: [
      ...PANEL_AXES.map(axis => ({
        type: 'rect' as const,
        layer: 'below' as const,
        xref: 'paper' as const,
        yref: `${axis} domain` as const,
        x0: 0,
        x1: 1,
        y0: 0,
        y1: 1,
        fillcolor: theme.border,
        opacity: PANEL_OPACITY,
        line: { width: 0 },
      })),
      ...genome.chromosomes.slice(1).map(c => ({
        type: 'line' as const,
        xref: 'x' as const,
        yref: 'paper' as const,
        x0: c.offset,
        x1: c.offset,
        y0: 0,
        y1: 1,
        line: { color: theme.border, width: 1 },
      })),
      ...(
        [
          ['y', 1],
          ['y2', 0.5],
        ] as const
      ).map(([yref, y]) => ({
        type: 'line' as const,
        xref: 'paper' as const,
        yref,
        x0: 0,
        x1: 1,
        y0: y,
        y1: y,
        line: { color: theme.muted, width: 1, dash: 'dash' as const },
      })),
    ],
    annotations: [
      {
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        y: 0.085,
        showarrow: false,
        visible: !showGenes,
        font: { size: 11, color: theme.muted },
        text: labels.zoomForGenes,
      },
    ],
  };
}
