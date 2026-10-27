import type { CNVProfileSegment, Cytoband, GeneTrackGene } from '@/api/api';

import { chromosomeIndexAt, chromosomesInView, type Genome, type GenomeView } from './genome';
import {
  isChromosomeLevel,
  isExonView,
  isSegmentShown,
  placeGenes,
  PLOT_MARGIN,
  segmentValue,
  Y_AXES,
  type YAxisName,
} from './traces';

export type ClickTarget =
  | { kind: 'cnv'; index: number }
  | { kind: 'cytoband'; index: number }
  | { kind: 'gene'; index: number; exonIndex?: number };

/**
 * A clickable span in genome coordinates, from y0 to y1 on its axis, widened by padPx on screen.
 */
export type HitArea = {
  target: ClickTarget;
  yaxis: YAxisName;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  padPx: number;
};

/** The plot area in client pixels. */
export type PlotFrame = { left: number; top: number; width: number; height: number };

const SEGMENT_PAD_PX = 6;
const GENE_PAD_PX = 2;
const MIN_HIT_WIDTH_PX = 8;

export function plotFrame(graph: Element): PlotFrame {
  const rect = graph.getBoundingClientRect();
  return {
    left: rect.left + PLOT_MARGIN.l,
    top: rect.top + PLOT_MARGIN.t,
    width: rect.width - PLOT_MARGIN.l - PLOT_MARGIN.r,
    height: rect.height - PLOT_MARGIN.t - PLOT_MARGIN.b,
  };
}

export function segmentHitAreas(segments: CNVProfileSegment[], genome: Genome, showFiltered: boolean): HitArea[] {
  return segments.flatMap((segment, index) => {
    if (!isSegmentShown(segment, genome, showFiltered)) return [];
    const offset = genome.byName.get(segment.chromosome)!.offset;
    const y = segmentValue(segment);
    return [
      {
        target: { kind: 'cnv', index },
        yaxis: 'y',
        x0: offset + segment.start,
        x1: offset + segment.end,
        y0: y,
        y1: y,
        padPx: SEGMENT_PAD_PX,
      } satisfies HitArea,
    ];
  });
}

/**
 * The bar of each gene, from its lane to its label, and below the exon span each exon.
 */
export function geneHitAreas(genes: GeneTrackGene[], genome: Genome, view: GenomeView, pxPerBase: number): HitArea[] {
  const detailed = isExonView(view);
  return placeGenes(genes, genome, pxPerBase).flatMap(({ gene, index, start, end, offset, y }) => [
    {
      target: { kind: 'gene', index },
      yaxis: 'y4',
      x0: start,
      x1: end,
      y0: y - 0.3,
      y1: y + 0.6,
      padPx: GENE_PAD_PX,
    } satisfies HitArea,
    ...(detailed
      ? gene.exons.map(
          (exon, exonIndex) =>
            ({
              target: { kind: 'gene', index, exonIndex },
              yaxis: 'y4',
              x0: offset + exon.start,
              x1: offset + exon.end,
              y0: y - 0.3,
              y1: y + 0.3,
              padPx: GENE_PAD_PX,
            }) satisfies HitArea,
        )
      : []),
  ]);
}

export function cytobandHitAreas(cytobands: Cytoband[], genome: Genome, view: GenomeView): HitArea[] {
  if (!isChromosomeLevel(genome, view)) return [];
  const inView = new Set(chromosomesInView(genome, view).map(chromosome => chromosome.name));
  return cytobands.flatMap((band, index) => {
    if (!inView.has(band.chromosome)) return [];
    const offset = genome.byName.get(band.chromosome)!.offset;
    return [
      {
        target: { kind: 'cytoband', index },
        yaxis: 'y5',
        x0: offset + band.start,
        x1: offset + band.end,
        y0: Y_AXES.y5.range[0],
        y1: Y_AXES.y5.range[1],
        padPx: 0,
      } satisfies HitArea,
    ];
  });
}

/**
 * The chromosome and position under a client position, when it is inside the plot area.
 */
export function locusAt(
  genome: Genome,
  view: GenomeView,
  frame: PlotFrame,
  clientX: number,
  clientY: number,
): { chromosome: string; position: number } | undefined {
  const inside =
    clientX >= frame.left &&
    clientX <= frame.left + frame.width &&
    clientY >= frame.top &&
    clientY <= frame.top + frame.height;
  if (!inside) return undefined;
  const x = view.x0 + ((clientX - frame.left) / frame.width) * (view.x1 - view.x0);
  const chromosome = genome.chromosomes[chromosomeIndexAt(genome, x)];
  return { chromosome: chromosome.name, position: Math.max(1, Math.round(x - chromosome.offset)) };
}

/**
 * The area under a client position: the narrowest one, so that an exon wins over its gene. Areas
 * narrower than MIN_HIT_WIDTH_PX are widened to it.
 */
export function hitTest(
  areas: HitArea[],
  view: GenomeView,
  frame: PlotFrame,
  clientX: number,
  clientY: number,
): ClickTarget | undefined {
  const pxPerBase = frame.width / (view.x1 - view.x0);
  const toPx = (x: number) => frame.left + (x - view.x0) * pxPerBase;
  const toPy = (axis: YAxisName, y: number) => {
    const { domain, range } = Y_AXES[axis];
    const fraction = domain[0] + ((y - range[0]) / (range[1] - range[0])) * (domain[1] - domain[0]);
    return frame.top + (1 - fraction) * frame.height;
  };

  let best: HitArea | undefined;
  for (const area of areas) {
    const left = toPx(area.x0);
    const right = toPx(area.x1);
    const grow = Math.max(0, MIN_HIT_WIDTH_PX - (right - left)) / 2;
    if (clientX < left - grow || clientX > right + grow) continue;
    if (clientY < toPy(area.yaxis, area.y1) - area.padPx || clientY > toPy(area.yaxis, area.y0) + area.padPx) continue;
    if (!best || area.x1 - area.x0 < best.x1 - best.x0) best = area;
  }
  return best?.target;
}
