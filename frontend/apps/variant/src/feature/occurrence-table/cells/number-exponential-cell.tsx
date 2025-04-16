import EmptyCell from '@/feature/occurrence-table/cells/empty-cell';
import { canQuotientBeComputed } from '@/components/lib/number-format';

type NumberCellProps = {
  value?: number;
  total?: number;
};

function NumberExponentialCell({ value, total }: NumberCellProps) {
  if (value === undefined) return <EmptyCell />;
  if (total === undefined) return <EmptyCell />;
  if (!canQuotientBeComputed(value, total)) return <EmptyCell />;

  return <span>{`${value} / ${total}`}</span>;
}

export default NumberExponentialCell;
