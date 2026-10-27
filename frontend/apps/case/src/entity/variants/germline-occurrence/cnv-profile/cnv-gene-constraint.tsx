import { cn } from '@/components/lib/utils';

import { type ConstraintLevel, loeufLevel, pliLevel } from './libs/constraint';

const DOT: Record<ConstraintLevel, string> = {
  intolerant: 'bg-red-500',
  intermediate: 'bg-orange-500',
  tolerant: 'bg-green-500',
};

type ConstraintValueProps = {
  kind: 'pli' | 'loeuf';
  value?: number;
};

/**
 * A gnomAD constraint score of a gene, behind a dot of the colour of its level.
 */
function CNVGeneConstraint({ kind, value }: ConstraintValueProps) {
  if (value === undefined) return <span>-</span>;
  const level = kind === 'pli' ? pliLevel(value) : loeufLevel(value);
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums">
      {level && <span aria-hidden className={cn('size-2 shrink-0 rounded-full', DOT[level])} />}
      {value.toFixed(2)}
    </span>
  );
}

export default CNVGeneConstraint;
