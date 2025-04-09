import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import HighBadgeIcon from '@/components/base/icons/high-badge-icon';
import LowBadgeIcon from '@/components/base/icons/low-badge-icon';
import ModerateBadgeIcon from '@/components/base/icons/moderate-badge-icon';
import ModifierBadgeIcon from '@/components/base/icons/modifier-badge-icon';
import { cn } from '@/components/lib/utils';

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
      return <HighBadgeIcon className="text-red-500" />;
    case Impact.Low:
      return <LowBadgeIcon className="text-green-500" />;
    case Impact.Moderate:
      return <ModerateBadgeIcon className="text-yellow-500" />;
    case Impact.Modifier:
      return <ModifierBadgeIcon className="text-gray-500" />;
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
