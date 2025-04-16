import EmptyCell from '@/feature/occurrence-table/cells/empty-cell';

type NumberCellProps = {
  value?: number;
  format?: string;
};

function NumberCell({ value }: NumberCellProps) {
  if (value === undefined) return <EmptyCell />;

  return <span>{value}</span>;
}

export default NumberCell;
