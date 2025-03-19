import { CellContext, HeaderContext } from '@tanstack/react-table';
import { Checkbox, CheckboxProps } from '../ui/checkbox';

/**
 * Return TableRowSelection for a column header
 * e.g.
 * {
 *  id: "row_selection",
 *  header: getTableRowSelectionHeader,
 *  cell: getTableRowSelectionCell,
 *  size: 32,
 *  minSize: 24,
 * }
 */
export function getTableRowSelectionHeader({ table }: HeaderContext<any, any>) {
  return (
    <Checkbox
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
      onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}

/**
 * Return TableRowSelection for a column cell
 * e.g.
 * {
 *  id: "row_selection",
 *  header: getTableRowSelectionHeader,
 *  cell: getTableRowSelectionCell,
 *  size: 32,
 *  minSize: 24,
 * }
 */
export function getTableRowSelectionCell({ row }: CellContext<any, any>) {
  return (
    <div className="pl-2">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  );
}
