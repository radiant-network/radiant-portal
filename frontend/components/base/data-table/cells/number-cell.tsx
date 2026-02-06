import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { thousandNumberFormat } from '@/components/lib/number-format';

type NumberCellProps = {
  value?: number;
  fractionDigits?: number;
};

function NumberCell({ value, fractionDigits = 2 }: NumberCellProps) {
  if (value === undefined) return <EmptyCell />;

  return (
    <span>
      {thousandNumberFormat(value, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      })}
    </span>
  );
}

export default NumberCell;
