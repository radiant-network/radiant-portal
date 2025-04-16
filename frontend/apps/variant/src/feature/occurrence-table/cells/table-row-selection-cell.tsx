import { Checkbox } from '@/components/base/ui/checkbox';
import { Row } from '@tanstack/react-table';

type TableRowSelectionCellProps = {
  row: Row<any>;
};

function RowSelectionCell({ row }: TableRowSelectionCellProps) {
  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  );
}

export default RowSelectionCell;
