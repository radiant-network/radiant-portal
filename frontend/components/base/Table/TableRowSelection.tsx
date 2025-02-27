import { useEffect, useRef } from "react";
import { CellContext, HeaderContext } from "@tanstack/react-table";

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
export const getTableRowSelectionHeader = ({
  table,
}: HeaderContext<any, any>) => (
  <TableRowSelection
    checked={table.getIsAllRowsSelected()}
    indeterminate={table.getIsSomeRowsSelected()}
    onChange={table.getToggleAllRowsSelectedHandler()}
  />
);

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
export const getTableRowSelectionCell = ({ row }: CellContext<any, any>) => (
  <div className="px-1">
    <TableRowSelection
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      indeterminate={row.getIsSomeSelected()}
      onChange={row.getToggleSelectedHandler()}
    />
  </div>
);

/**
 * Table row select component. Allow row selection
 */
type TableRowSelectCheckboxProps = {
  indeterminate: boolean;
  className?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (event: unknown) => void;
};

export const TableRowSelection = ({
  indeterminate,
  className = "",
  ...rest
}: TableRowSelectCheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
};
