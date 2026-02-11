import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { toExponentialNotation } from '@/components/lib/number-format';

interface FrequencyCellProps {
  pc?: number;
  pn?: number;
  pf?: number;
}

function FrequencyCell({ pc, pn, pf }: FrequencyCellProps) {
  if (pn == null) {
    return <EmptyCell />;
  }

  return (
    <span>
      {pc}/{pn}
      {pf && ` (${toExponentialNotation(pf)})`}
    </span>
  );
}

export default FrequencyCell;
