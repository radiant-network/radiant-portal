/** How dosage sensitive a gnomAD constraint score says a gene is, from Franklin's thresholds. */
export type ConstraintLevel = 'intolerant' | 'intermediate' | 'tolerant';

const PLI_INTOLERANT = 0.9;
const PLI_TOLERANT = 0.1;
const LOEUF_INTOLERANT = 0.35;

/** pLI ≥ 0.9 is extremely loss-of-function intolerant, pLI ≤ 0.1 tolerant. */
export function pliLevel(pli?: number): ConstraintLevel | undefined {
  if (pli === undefined) return undefined;
  if (pli >= PLI_INTOLERANT) return 'intolerant';
  if (pli <= PLI_TOLERANT) return 'tolerant';
  return 'intermediate';
}

/** LOEUF < 0.35 is likely haploinsufficient; above, the score flags nothing. */
export function loeufLevel(loeuf?: number): ConstraintLevel | undefined {
  if (loeuf === undefined) return undefined;
  return loeuf < LOEUF_INTOLERANT ? 'intolerant' : undefined;
}
