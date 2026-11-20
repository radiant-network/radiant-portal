/**
 * How dosage sensitive a gnomAD v4 constraint score says a gene is, from the gnomAD recommendations:
 * LOEUF < 0.45 since v4.1.1 (0.35 in v2, 0.6 in v4.0), pLI unchanged.
 */
export type ConstraintLevel = 'intolerant' | 'intermediate' | 'tolerant';

const PLI_INTOLERANT = 0.9;
const PLI_TOLERANT = 0.1;
const LOEUF_INTOLERANT = 0.45;

/** pLI ≥ 0.9 is extremely loss-of-function intolerant, pLI ≤ 0.1 tolerant. */
export function pliLevel(pli?: number): ConstraintLevel | undefined {
  if (pli === undefined) return undefined;
  if (pli >= PLI_INTOLERANT) return 'intolerant';
  if (pli <= PLI_TOLERANT) return 'tolerant';
  return 'intermediate';
}

/** LOEUF < 0.45 is pLoF constrained (15th gene percentile or lower); above, the score flags nothing. */
export function loeufLevel(loeuf?: number): ConstraintLevel | undefined {
  if (loeuf === undefined) return undefined;
  return loeuf < LOEUF_INTOLERANT ? 'intolerant' : undefined;
}
