import { VepImpact } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import ConsequenceIndicator from '@/components/base/indicators/consequence-indicator';
import { cn } from '@/components/lib/utils';

type MostDeleteriousConsequenceCellProps = {
  vepImpact?: VepImpact;
  consequences?: string[];
  aaChange?: string;
};

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
      <ConsequenceIndicator vepImpact={vepImpact} consequence={consequences[0]} size="sm" />
      {aaChange && ` - ${aaChange}`}
    </div>
  );
}

export default MostDeleteriousConsequenceCell;
