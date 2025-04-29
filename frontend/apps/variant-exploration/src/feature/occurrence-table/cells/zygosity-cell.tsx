import EmptyCell from '@/feature/occurrence-table/cells/empty-cell';

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
      }[value] ?? null}
    </span>
  );
}

export default ZygosityCell;
