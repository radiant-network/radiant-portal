import { Checkbox } from '@/components/base/ui/checkbox';
import { Table } from '@tanstack/react-table';

type RowSelectionHeaderProps = {
  table: Table<any>;
};

function RowSelectionHeader({ table }: RowSelectionHeaderProps) {
  return (
    <div className="flex items-center justify-center w-full">
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  );
}

export default RowSelectionHeader;
