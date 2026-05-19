import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { VariantEntityTabs } from '@/components/cores/types/variant-tabs';
import { toExponentialNotation } from '@/components/lib/number-format';

type NumberCellProps = {
  pc?: number;
  pf?: number;
  locusId?: string;
};

function TumorNormalFrequencyCell({ pc, pf, locusId }: NumberCellProps) {
  if (pc === undefined || locusId === undefined || pf === undefined) {
    return <EmptyCell />;
  }

  const scientificNotationPF = toExponentialNotation(pf);
  return (
    <AnchorLink
      size="sm"
      href={`/variants/entity/${locusId}?tab=${VariantEntityTabs.Cases}&cases=OtherCases`}
      target="_blank"
    >
      {pc} ({scientificNotationPF ? scientificNotationPF : pf})
    </AnchorLink>
  );
}

export default TumorNormalFrequencyCell;
