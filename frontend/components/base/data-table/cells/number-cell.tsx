import EmptyCell from "@/components/base/data-table/cells/empty-cell";

type NumberCellProps = {
  value?: number;
};

function NumberCell({ value }: NumberCellProps) {
  if (value === undefined) return <EmptyCell />;

  return <span>{value}</span>;
}

export default NumberCell;
