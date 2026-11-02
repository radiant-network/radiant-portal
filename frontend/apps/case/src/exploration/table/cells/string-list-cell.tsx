import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type StringListCellProps = {
  values?: string[];
};

function StringListCell({ values }: StringListCellProps) {
  if (!values || values.length === 0) return <EmptyCell />;

  return (
    <div className="flex flex-col">
      {values.map(value => (
        <span key={value}>{value}</span>
      ))}
    </div>
  );
}

export default StringListCell;
