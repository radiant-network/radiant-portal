import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  PaginationState,
  getPaginationRowModel,
  ColumnOrderState,
  getExpandedRowModel,
  OnChangeFn,
  SortingState,
  SortDirection,
} from "@tanstack/react-table";

import { ArrowDownAZ, ArrowDownZA } from "lucide-react";
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
import { SortBody, SortBodyOrderEnum } from "@/api/api";
import { Skeleton } from "@/components/base/ui/skeleton";

export interface TableColumnDef<TData, TValue>
  extends Omit<ColumnDef<TData, TValue>, "id" | "header"> {
  id: string;
  header: string;
  subComponent?: string;
}

type TableProps<TData> = {
  columns: TableColumnDef<TData, any>[];
  columnSettings: ColumnSettings[];
  data: TData[];
  defaultColumnSettings: ColumnSettings[];
  defaultServerSorting: SortBody[];
  loadingStates?: {
    total?: boolean;
    list?: boolean;
  };
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  onServerSortingChange: (sorting: SortBody[]) => void;
  subComponent?: (data: TData) => React.JSX.Element;
  total: number;
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
export function createColumnSettings(
  settings: BaseColumnSettings[]
): ColumnSettings[] {
  return settings.map((setting, index) => ({
    ...setting,
    index,
  }));
}

/**
 * Read user config to produce an object with column visibility value
 * @param settings
 * @returns {
 *  column.id: visibility,
 * }
 */
function deserializeColumnVisibility(
  settings: ColumnSettings[]
): ColumnVisiblity {
  const result: ColumnVisiblity = {};
  settings.forEach((setting) => {
    result[setting.id] = setting.visible;
  });
  return result;
}

/**
 * Read user config to return column order (in asc)
 * @param settings
 * @returns [{ column.id: visibility }]
 */
function deserializeColumnOrder(settings: ColumnSettings[]): ColumnOrderState {
  return settings
    .sort((a, b) => a.index - b.index)
    .map((setting) => setting.id);
}

/**
 * Use header.column.getNextSortingOrder() to display the next action on sort
 * @param sortingOrder 'asc' | 'desc' | false
 * @returns String
 */
function getNextSortingOrderHeaderTitle(
  sortingOrder: SortDirection | boolean
): string {
  if (sortingOrder === "asc") {
    return "Sort ascending";
  }

  if (sortingOrder === "desc") {
    return "Sort descending";
  }

  return "Clear sort";
}

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
 *
 * Row selection
 * [{
 *  id: "row_selection",
 *  header: getTableRowSelectionHeader,
 *  cell: getTableRowSelectionCell
 * }]
 *
 * Row Expand for sub component
 * [{
 *  id: "row_expand",
 *  cell: RowExpandCell
 * }]
 */
function DataTable({
  columns,
  columnSettings,
  data,
  defaultColumnSettings,
  defaultServerSorting,
  loadingStates,
  pagination,
  onPaginationChange,
  onServerSortingChange,
  subComponent,
  total,
}: TableProps<any>) {
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
  const [sorting, setSorting] = useState<SortingState>([]);

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
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
    onPaginationChange,
    onSortingChange: setSorting,
    isMultiSortEvent: (_e) => true,
    pageCount: total / pagination.pageSize,
    manualPagination: true,
    state: {
      pagination,
      columnVisibility,
      columnOrder,
      sorting,
    },
  });

  function handleVisiblityChange(target: string, checked: boolean) {
    setColumnVisibility({ ...columnVisibility, [target]: checked });
  }

  // @TODO: shout save column width in user data
  useResizeObserver(table.getState(), (columnId, columnSize) => {
    console.log(columnId);
    console.log(columnSize);
  });

  /**
   * Sorting useEffect
   * Update server-side calls to use the new sorting settings
   * Reset pagination at the same time
   */
  useEffect(() => {
    if (sorting.length === 0) {
      onServerSortingChange(defaultServerSorting);
    } else {
      onServerSortingChange(
        sorting.map((s) => ({
          field: s.id,
          order: s.desc ? SortBodyOrderEnum.Desc : SortBodyOrderEnum.Asc,
        }))
      );
    }

    onPaginationChange({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  }, [sorting]);

  return (
    <div className="block min-w-full w-full overflow-x-auto overflow-y-auto">
      <div className="w-full flex text-left justify-between mb-4">
        <TableIndexResult
          loading={loadingStates?.total}
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
                  className="border border-border relative"
                >
                  <div
                    className={cn(
                      "flex align-middle gap-2",
                      header.column.getCanSort() && "cursor-pointer select-none"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    title={
                      header.column.getCanSort()
                        ? getNextSortingOrderHeaderTitle(
                            header.column.getNextSortingOrder()
                          )
                        : undefined
                    }
                  >
                    {/* Header rendering */}
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {/* Sorted Icons */}
                    {{
                      asc: <ArrowDownAZ size={16} />,
                      desc: <ArrowDownZA size={16} />,
                    }[header.column.getIsSorted() as string] ?? null}

                    {/* Resize Grip */}
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
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {/* Loading Skeleton */}
          {loadingStates?.list &&
            new Array(pagination.pageSize).fill(0).map((_, index) => (
              <TableRow className="border border-border p-2 font-normal text-left truncate">
                <TableCell
                  key={`skeleton-row-${index}`}
                  colSpan={columnSettings.length}
                  className="border border-border p-2 font-normal text-left truncate"
                >
                  <Skeleton className="w-full h-[32px]" />
                </TableCell>
              </TableRow>
            ))}

          {/* Display list */}
          {table.getRowModel().rows.map((row) => (
            <>
              <TableRow
                key={row.id}
                className={row.index % 2 != 0 ? "bg-gray-50" : ""}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border border-border p-2 font-normal text-left truncate"
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
      <div className="flex items-center justify-end space-x-2 py-4 mt-4">
        <div>
          {/* PageSize select */}
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="min-w-[125px] h-8">
              <SelectValue>{table.getState().pagination.pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem value={String(pageSize)}>{pageSize}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          {/* Pagination */}
          <Pagination className="w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={!table.getCanPreviousPage()}
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
                  disabled={!table.getCanNextPage()}
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
    </div>
  );
}

export default DataTable;
