import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { cn } from '@/components/lib/utils';
import ShapeTriangleUpIcon from '@/components/base/icons/shape-triangle-up-icon';
import ShapeDiamondIcon from '@/components/base/icons/shape-diamond-icon';
import ShapeCircleIcon from '@/components/base/icons/shape-circle-icon';
import ShapeTriangleDownIcon from '@/components/base/icons/shape-triangle-down-icon';

export enum Impact {
  High = 'HIGH',
  Moderate = 'MODERATE',
  Low = 'LOW',
  Modifier = 'MODIFIER',
}

type MostDeleteriousConsequenceCellProps = {
  vepImpact?: Impact;
  consequences?: string[];
  aaChange?: string;
};

function getImpactBadge(impact: Impact) {
  switch (impact) {
    case Impact.High:
      return <ShapeTriangleUpIcon size={10} className="text-red" />;
    case Impact.Low:
      return <ShapeTriangleDownIcon size={10} className="text-green" />;
    case Impact.Moderate:
      return <ShapeDiamondIcon size={10} className="text-yellow" />;
    case Impact.Modifier:
      return <ShapeCircleIcon size={10} className="text-slate" />;
    default:
      return;
  }
}

/**
 * Only show the most deleterious consequence out of all the consequences for the variant
 * Order of display:
 * 1) vep_impact displayed with an icon (red triangle, circle, etc.., use existing mechanism)
 * 2) consequence displayed in text (e.g., Stop Gained, Intron variant, etc.) Follow this formatting for the values.
 *    @dico.snv.consequences.consequences
 * 3) “-”
 * 4) aa_Change, displayed in text for the Amino Acid change
 * e.g. [VEP icon] Missense - p.Ter250Arg
 *
 * @fixme aa_change is empty in api at the moment
 */
function MostDeleteriousConsequenceCell({ vepImpact, consequences, aaChange }: MostDeleteriousConsequenceCellProps) {
  if (vepImpact === undefined || consequences === undefined) return <EmptyCell />;

  return (
    <div className={cn('flex items-center gap-2')}>
      {getImpactBadge(vepImpact)} {consequences[0]}
      {aaChange && ` - ${aaChange}`}
    </div>
  );
}

export default MostDeleteriousConsequenceCell;
