import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type TextListCellProps = {
  values?: string[];
};

function TextListCell({ values }: TextListCellProps) {
  if (!values || values.length === 0) return <EmptyCell />;

  return (
    <div className="flex flex-col">
      {values.map(value => (
        <span key={value}>{value}</span>
      ))}
    </div>
  );
}

export default TextListCell;
