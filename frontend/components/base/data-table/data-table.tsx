import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  PaginationState,
  getPaginationRowModel,
  ColumnOrderState,
  getExpandedRowModel,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import TableColumnSettings from "@/components/base/data-table/data-table-column-settings";
import { useResizeObserver } from "@/components/base/data-table/hooks/use-resize-observer";
import TableIndexResult from "@/components/base/data-table/data-table-index-result";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/base/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/base/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base/ui/select";

export interface TableColumnDef<TData, TValue>
  extends Omit<ColumnDef<TData, TValue>, "id" | "header"> {
  id: string;
  header: string;
  subComponent?: string;
}

type TableProps<TData> = {
  total: number;
  columns: TableColumnDef<TData, any>[];
  data: TData[];
  columnSettings: ColumnSettings[];
  defaultColumnSettings: ColumnSettings[];
  subComponent?: (data: TData) => React.JSX.Element;
};

export interface BaseColumnSettings {
  id: string;
  visible: boolean;
  fixed?: boolean;
  size?: number;
}

export interface ColumnSettings extends BaseColumnSettings {
  index: number;
}

type ColumnVisiblity = {
  [id: string]: boolean;
};

/**
 * Automate index create for column settings
 * @param settings BaseColumnSettings[]
 * @returns ColumnSettings[]
 */
export const createColumnSettings = (
  settings: BaseColumnSettings[]
): ColumnSettings[] =>
  settings.map((setting, index) => ({
    ...setting,
    index,
  }));

/**
 * Read user config to produce an object with column visibility value
 * @param settings
 * @returns {
 *  column.id: visibility,
 * }
 */
const deserializeColumnVisibility = (
  settings: ColumnSettings[]
): ColumnVisiblity => {
  const result: ColumnVisiblity = {};
  settings.forEach((setting) => {
    result[setting.id] = setting.visible;
  });
  return result;
};

/**
 * Read user config to return column order (in asc)
 * @param settings
 * @returns [{ column.id: visibility }]
 */
const deserializeColumnOrder = (
  settings: ColumnSettings[]
): ColumnOrderState => {
  return settings
    .sort((a, b) => a.index - b.index)
    .map((setting) => setting.id);
};

/**
 * Table
 *
 * columns
 * define the mapping between the column and the cell component
 * @see https://tanstack.com/table/latest/docs/guide/column-defs#creating-accessor-columns
 * [
 *  columnHelper.accessor((row) => row.hgvsg, {
 *   id: "hgvsg",
 *   cell: (info) => info.getValue(),
 *   header: "Variant",
 *   size: 100,
 *   minSize: 50,
 *  })
 * ]
 *
 * columnSettings (saved by user) and defaultColumnSettings
 * manage order, visibility, fixed status of each column
 *  [{
 *   "key": "{column.id}",
 *   "index": 16,
 *   "visible": {boolean},
 *   "fixed": {boolean},
 *  }]
 */
const DataTable = ({
  columns,
  total,
  data,
  columnSettings,
  defaultColumnSettings,
  subComponent,
}: TableProps<any>) => {
  // default values
  const defaultColumnVisibility = deserializeColumnVisibility(
    defaultColumnSettings
  );
  const defaultColumnOrder = deserializeColumnOrder(defaultColumnSettings);

  // table interactions
  const [columnVisibility, setColumnVisibility] = useState(
    deserializeColumnVisibility(columnSettings)
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    deserializeColumnOrder(columnSettings)
  );
  // TODO: should be connected to user api
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Initialize tanstack table
  const table = useReactTable({
    columns,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      pagination,
      columnVisibility,
      columnOrder,
    },
  });

  const handleVisiblityChange = (target: string, checked: boolean) => {
    setColumnVisibility({ ...columnVisibility, [target]: checked });
  };

  // @TODO: shout save column width in user data
  useResizeObserver(table.getState(), (columnId, columnSize) => {
    console.log(columnId);
    console.log(columnSize);
  });

  return (
    <div className="block min-w-full w-full overflow-x-auto overflow-y-auto">
      <div className="w-full flex text-left justify-between">
        <TableIndexResult
          pageIndex={table.getState().pagination.pageIndex + 1}
          pageSize={table.getState().pagination.pageSize}
          total={total}
        />
        <TableColumnSettings
          columns={columns}
          defaultSettings={defaultColumnSettings}
          visiblitySettings={columnVisibility}
          handleVisiblityChange={handleVisiblityChange}
          handleOrderChange={setColumnOrder}
          pristine={
            JSON.stringify(defaultColumnOrder) == JSON.stringify(columnOrder) &&
            JSON.stringify(defaultColumnVisibility) ==
              JSON.stringify(columnVisibility)
          }
          handleReset={() => {
            setColumnOrder(defaultColumnOrder);
            setColumnVisibility(defaultColumnVisibility);
          }}
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() }}
                  className="border relative"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  <div
                    onDoubleClick={() => header.column.resetSize()}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={cn(
                      "absolute top-0 h-full w-[4px] right-0 bg-black/50 cursor-col-resize select-none touch-none opacity-0 hover:opacity-50",
                      table.options.columnResizeDirection,
                      header.column.getIsResizing() ? "opacity-100" : ""
                    )}
                  />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <>
              <TableRow
                key={row.id}
                className={row.index % 2 != 0 ? "bg-gray-50" : ""}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border border-gray-100 p-2 font-normal text-left truncate"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {subComponent && row.getIsExpanded() && (
                <TableRow key={`${row.id}-sub`}>
                  <TableCell colSpan={row.getVisibleCells().length}>
                    {subComponent(row.original)}
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-[180px] border-gray-300 bg-gray-100">
            <SelectValue>{table.getState().pagination.pageSize}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem value={String(pageSize)}>{pageSize}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Pagination className="w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={cn(
                  !table.getCanPreviousPage()
                    ? "pointer-events-none disabled text-gray-400"
                    : ""
                )}
                onClick={() => {
                  if (!table.getCanPreviousPage()) return;
                  table.previousPage();
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => table.firstPage()}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className={cn(
                  !table.getCanNextPage()
                    ? "pointer-events-none disabled text-gray-400"
                    : ""
                )}
                onClick={() => {
                  if (!table.getCanNextPage()) return;
                  table.nextPage();
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default DataTable;
