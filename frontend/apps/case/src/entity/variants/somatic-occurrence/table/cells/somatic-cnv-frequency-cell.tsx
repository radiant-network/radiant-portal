import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { toExponentialNotation } from '@/components/lib/number-format';

type SomaticCNVFrequencyCellProps = {
  pc?: number;
  pf?: number;
};

function SomaticCNVFrequencyCell({ pc, pf }: SomaticCNVFrequencyCellProps) {
  if (pc === undefined || pf === undefined) return <EmptyCell />;

  const scientificNotationPF = toExponentialNotation(pf);

  return (
    <>
      {pc} ({scientificNotationPF ? scientificNotationPF : pf})
    </>
  );
}

export default SomaticCNVFrequencyCell;
