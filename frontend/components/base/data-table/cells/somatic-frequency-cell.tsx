import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { CaseEntityCasesTabs } from '@/components/cores/types/case-tabs';
import { VariantEntityTabs } from '@/components/cores/types/variant-tabs';
import { toExponentialNotation } from '@/components/lib/number-format';

type SomaticFrequencyCellProps = {
  pc?: number;
  pf?: number;
  locusId?: string;
};

function SomaticFrequencyCell({ pc, pf, locusId }: SomaticFrequencyCellProps) {
  if (pc === undefined || locusId === undefined || pf === undefined) {
    return <EmptyCell />;
  }

  const scientificNotationPF = toExponentialNotation(pf);
  return (
    <AnchorLink
      size="sm"
      href={`/variants/entity/${locusId}?tab=${VariantEntityTabs.Cases}&cases=${CaseEntityCasesTabs.OtherCases}`}
      target="_blank"
    >
      {pc} ({scientificNotationPF ? scientificNotationPF : pf})
    </AnchorLink>
  );
}

export default SomaticFrequencyCell;
