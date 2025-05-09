import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type NumberCellProps = {
  value?: number;
  format?: string;
};

function NumberCell({ value }: NumberCellProps) {
  if (value === undefined) return <EmptyCell />;

  return <span>{value.toFixed(2)}</span>;
}

export default NumberCell;
