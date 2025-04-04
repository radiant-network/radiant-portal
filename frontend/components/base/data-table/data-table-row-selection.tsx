import { CellContext, HeaderContext } from '@tanstack/react-table';
import { Checkbox } from '../ui/checkbox';

/**
 * Return TableRowSelection for a column header
 * e.g.
 * {
 *  id: "row_selection",
 *  header: getTableRowSelectionHeader,
 *  cell: getTableRowSelectionCell,
 * }
 */
export function getTableRowSelectionHeader({ table }: HeaderContext<any, any>) {
  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  );
}

/**
 * Return TableRowSelection for a column cell
 * e.g.
 * {
 *  id: "row_selection",
 *  header: getTableRowSelectionHeader,
 *  cell: getTableRowSelectionCell,
 * }
 */
export function getTableRowSelectionCell({ row }: CellContext<any, any>) {
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
