import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type ZygosityCellProps = {
  value?: string;
};

function ZygosityCell({ value }: ZygosityCellProps) {
  if (!value) return <EmptyCell />;

  return (
    <span>
      {{
        HEM: '1',
        HET: '0/1',
      }[value] ?? '-'}
    </span>
  );
}

export default ZygosityCell;
