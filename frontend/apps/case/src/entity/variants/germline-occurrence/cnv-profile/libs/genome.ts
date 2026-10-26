import type { CNVProfileChromosome } from '@/api/api';

export type GenomeChromosome = CNVProfileChromosome & { offset: number };

export type Genome = {
  chromosomes: GenomeChromosome[];
  byName: Map<string, GenomeChromosome>;
  length: number;
};

export type GenomeView = { x0: number; x1: number };

export const MIN_SPAN = 500;

export function createGenome(chromosomes: CNVProfileChromosome[]): Genome {
  let offset = 0;
  const placed = chromosomes.map(chromosome => {
    const placedChromosome = { ...chromosome, offset };
    offset += chromosome.size;
    return placedChromosome;
  });
  return { chromosomes: placed, byName: new Map(placed.map(c => [c.name, c])), length: offset };
}

export function chromosomeIndexAt(genome: Genome, position: number): number {
  let lo = 0;
  let hi = genome.chromosomes.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (genome.chromosomes[mid].offset <= position) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export function chromosomesInView(genome: Genome, view: GenomeView): GenomeChromosome[] {
  const first = chromosomeIndexAt(genome, view.x0);
  const last = chromosomeIndexAt(genome, Math.max(view.x0, view.x1 - 1));
  return genome.chromosomes.slice(first, last + 1);
}

export function toGenomePosition(genome: Genome, chromosome: string, position: number): number | undefined {
  const placed = genome.byName.get(chromosome);
  return placed === undefined ? undefined : placed.offset + position;
}

/**
 * Keeps a view inside the genome and above MIN_SPAN, keeping its width when it fits.
 */
export function clampView(genome: Genome, x0: number, x1: number): GenomeView {
  const span = Math.min(genome.length, Math.max(MIN_SPAN, x1 - x0));
  const start = Math.min(Math.max(0, (x0 + x1) / 2 - span / 2), genome.length - span);
  return { x0: start, x1: start + span };
}

export function viewAround(genome: Genome, chromosome: string, start: number, end: number, margin: number): GenomeView {
  const placed = genome.byName.get(chromosome);
  if (!placed) return { x0: 0, x1: genome.length };
  return clampView(
    genome,
    placed.offset + Math.max(0, start - margin),
    placed.offset + Math.min(placed.size, end + margin),
  );
}

type Ticks = { tickvals: number[]; ticktext: string[] };

/**
 * Chromosome names at their middle when three or more chromosomes are in view, local positions
 * otherwise.
 */
export function computeTicks(genome: Genome, view: GenomeView, formatPosition: (bases: number) => string): Ticks {
  const inView = chromosomesInView(genome, view);
  if (inView.length >= 3) {
    return {
      tickvals: inView.map(c => c.offset + c.size / 2),
      ticktext: inView.map(c => c.name),
    };
  }
  const raw = (view.x1 - view.x0) / 6;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map(m => m * magnitude).find(s => s >= raw) ?? magnitude * 10;
  const tickvals: number[] = [];
  const ticktext: string[] = [];
  for (const chromosome of inView) {
    const from = Math.ceil(Math.max(0, view.x0 - chromosome.offset) / step) * step;
    const to = Math.min(chromosome.size, view.x1 - chromosome.offset);
    for (let position = from; position <= to; position += step) {
      tickvals.push(chromosome.offset + position);
      ticktext.push(`${chromosome.name}:${formatPosition(position)}`);
    }
  }
  return { tickvals, ticktext };
}

export type Locus = { chromosome: string; start: number; end: number };

/**
 * Reads "17", "chr17" or "chr17:40,000,000-45,000,000".
 */
export function parseLocus(genome: Genome, input: string): Locus | undefined {
  const match = input.replace(/[,\s]/g, '').match(/^(?:chr)?([0-9]{1,2}|X|Y)(?::(\d+)-(\d+))?$/i);
  if (!match) return undefined;
  const chromosome = genome.byName.get(match[1].toUpperCase());
  if (!chromosome) return undefined;
  const start = match[2] ? Number(match[2]) : 0;
  const end = match[3] ? Number(match[3]) : chromosome.size;
  if (end <= start) return undefined;
  return { chromosome: chromosome.name, start, end };
}

/**
 * The region to fetch the genes of a view from: the view within one chromosome, widened on each
 * side and snapped to a grid so that small moves reuse it. Undefined when the view is too wide.
 */
export function geneWindow(genome: Genome, view: GenomeView, maxSpan: number): Locus | undefined {
  const inView = chromosomesInView(genome, view);
  const span = view.x1 - view.x0;
  if (inView.length !== 1 || span > maxSpan) return undefined;
  const [chromosome] = inView;
  const grid = 10 ** Math.ceil(Math.log10(span));
  const half = Math.min(maxSpan, 2 * grid) / 2;
  const middle = Math.round((view.x0 + view.x1) / 2 - chromosome.offset);
  const centre = Math.round(middle / (grid / 2)) * (grid / 2);
  const start = Math.max(0, Math.min(centre - half, view.x0 - chromosome.offset));
  const end = Math.min(chromosome.size, Math.max(centre + half, view.x1 - chromosome.offset));
  return { chromosome: chromosome.name, start: Math.floor(start), end: Math.ceil(Math.min(end, start + maxSpan)) };
}
