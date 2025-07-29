import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type NumberCellProps = {
  value?: number;
  fractionDigits?: number;
};

function NumberCell({ value, fractionDigits = 2 }: NumberCellProps) {
  if (value === undefined) return <EmptyCell />;

  return <span>{value.toFixed(fractionDigits)}</span>;
}

export default NumberCell;
