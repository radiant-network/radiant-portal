import * as React from "react";
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
import { Button } from "@/base/Buttons/Button";
import {
  DoubleLeftOutlinedIcon,
  LeftOutlinedIcon,
  RightOutlinedIcon,
} from "@/base/ui/icons";
import { TableColumnSettings } from "@/base/ui/table/tableColumnSettings";
import { cn } from "@/lib/utils";
import { useResizeObserver } from "@/base/ui/table/tableObserver";

export interface TableColumnDef<TData, TValue>
  extends Omit<ColumnDef<TData, TValue>, "id" | "header"> {
  id: string;
  header: string;
  subComponent?: string;
}

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
const createColumnSettings = (
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
type TableProps<TData> = {
  total: number;
  columns: TableColumnDef<TData, any>[];
  data: TData[];
  columnSettings: ColumnSettings[];
  defaultColumnSettings: ColumnSettings[];
  subComponent?: (data: TData) => JSX.Element;
};

const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  (
    {
      columns,
      total,
      data,
      columnSettings,
      defaultColumnSettings,
      subComponent,
    },
    ref
  ) => {
    // default values
    const defaultColumnVisibility = deserializeColumnVisibility(
      defaultColumnSettings
    );
    const defaultColumnOrder = deserializeColumnOrder(defaultColumnSettings);

    // table interactions
    const [columnVisibility, setColumnVisibility] = React.useState(
      deserializeColumnVisibility(columnSettings)
    );
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
      deserializeColumnOrder(columnSettings)
    );
    // TODO: should be connected to user api
    const [pagination, setPagination] = React.useState<PaginationState>({
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
      data,
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
      <div className="p-2 block min-w-full w-full overflow-x-auto overflow-y-auto">
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
              JSON.stringify(defaultColumnOrder) ==
                JSON.stringify(columnOrder) &&
              JSON.stringify(defaultColumnVisibility) ==
                JSON.stringify(columnVisibility)
            }
            handleReset={() => {
              setColumnOrder(defaultColumnOrder);
              setColumnVisibility(defaultColumnVisibility);
            }}
          />
        </div>
        <table className={"w-full text-left table-fixed"} ref={ref}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className="border relative bg-gray-100 border-gray-150 p-2 font-normal text-left truncate"
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
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <>
                <tr
                  key={row.id}
                  className={row.index % 2 != 0 ? "bg-gray-50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border border-gray-100 p-2 font-normal text-left truncate"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {subComponent && row.getIsExpanded() && (
                  <tr>
                    <td colSpan={row.getVisibleCells().length}>
                      {subComponent(row.original)}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end items-center gap-2">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <Button
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <DoubleLeftOutlinedIcon /> First
          </Button>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <LeftOutlinedIcon />
            Prev.
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next <RightOutlinedIcon />
          </Button>
        </div>
      </div>
    );
  }
);
Table.displayName = "Table";

/**
 * TableIndexResult
 * show current page and total page
 */
type TableIndexResultProp = {
  total: number;
  pageIndex: number;
  pageSize: number;
};

const TableIndexResult = React.forwardRef<
  HTMLSpanElement,
  TableIndexResultProp
>(({ total, pageIndex, pageSize }, ref) => {
  const result = total;
  const to = pageSize * pageIndex;
  const from = to - pageSize + 1;
  return (
    <span ref={ref}>
      Results {from} - {to} of {result}
    </span>
  );
});
TableIndexResult.displayName = "TableIndexResult";

export { Table, createColumnSettings };
