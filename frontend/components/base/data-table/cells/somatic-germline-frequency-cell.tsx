import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { toExponentialNotation } from '@/components/lib/number-format';

type NumberCellProps = {
  pc?: number;
  pf?: number;
  locusId?: string;
};

function SomaticGermlineFrequencyCell({ pc, pf, locusId }: NumberCellProps) {
  if (pc === undefined || locusId === undefined || pf === undefined) {
    return <EmptyCell />;
  }

  const scientificNotationPF = toExponentialNotation(pf);
  return (
    <AnchorLink size="sm" href={`/variants/entity/${locusId}?tab=patients&cases=InterpretedCases`} target="_blank">
      {pc} ({scientificNotationPF ? scientificNotationPF : pf})
    </AnchorLink>
  );
}

export default SomaticGermlineFrequencyCell;
