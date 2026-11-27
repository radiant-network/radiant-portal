export const DEPTHS = [5, 15, 30, 50, 100, 200, 300, 400, 500, 1000] as const;
export const CUTOFFS = [100, 98, 95, 90] as const;

export const DEFAULT_DEPTH = 15;
export const DEFAULT_CUTOFF = 100;

const WARNING_FLOOR = 90;
const UNMAPPABLE_MEAN = 5;
const UNMAPPABLE_PCT_AT_FIRST_DEPTH = 10;

export type CoverageStatus = 'fail' | 'warning' | 'unmappable' | 'pass';

export type GeneCoverage = {
  gene: string;
  size: number;
  mean: number;
  /** % of bases at or above each depth of DEPTHS, same order */
  pct: number[];
};

export type CoverageCriteria = {
  depth: number;
  cutoff: number;
};

const STATUS_ORDER: CoverageStatus[] = ['fail', 'warning', 'unmappable', 'pass'];

export function pctAt(gene: GeneCoverage, depth: number) {
  return gene.pct[(DEPTHS as readonly number[]).indexOf(depth)];
}

function toneOf(value: number, cutoff: number): Exclude<CoverageStatus, 'unmappable'> {
  if (value >= cutoff) return 'pass';
  return value >= WARNING_FLOOR ? 'warning' : 'fail';
}

export function isUnmappable(gene: GeneCoverage) {
  return gene.mean < UNMAPPABLE_MEAN || gene.pct[0] < UNMAPPABLE_PCT_AT_FIRST_DEPTH;
}

export function getStatus(gene: GeneCoverage, { depth, cutoff }: CoverageCriteria): CoverageStatus {
  if (isUnmappable(gene)) return 'unmappable';
  return toneOf(pctAt(gene, depth), cutoff);
}

/**
 * Tone of a "% ≥ Nx" cell: from its own value, only for depths up to the selected one.
 */
export function getCellTone(
  gene: GeneCoverage,
  columnDepth: number,
  { depth, cutoff }: CoverageCriteria,
): CoverageStatus | undefined {
  if (isUnmappable(gene) || columnDepth > depth) return undefined;
  return toneOf(pctAt(gene, columnDepth), cutoff);
}

/**
 * Worst first: by status, then by % at the selected depth, then by gene name.
 */
export function sortWorstFirst(genes: GeneCoverage[], criteria: CoverageCriteria) {
  return [...genes].sort(
    (a, b) =>
      STATUS_ORDER.indexOf(getStatus(a, criteria)) - STATUS_ORDER.indexOf(getStatus(b, criteria)) ||
      pctAt(a, criteria.depth) - pctAt(b, criteria.depth) ||
      a.gene.localeCompare(b.gene),
  );
}
