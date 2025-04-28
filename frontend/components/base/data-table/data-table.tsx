import { CSSProperties, useEffect, useMemo, useState, Fragment, useRef } from 'react';
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
  Column,
  ColumnPinningPosition,
  ColumnPinningState,
} from '@tanstack/react-table';

import { ArrowDownAZ, ArrowDownUp, ArrowDownZA, ArrowUpZA, Maximize, Minimize, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import TableColumnSettings from '@/components/base/data-table/data-table-column-settings';
import { useResizeObserver } from '@/components/base/data-table/hooks/use-resize-observer';
import TableIndexResult from '@/components/base/data-table/data-table-index-result';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/base/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { SortBody, SortBodyOrderEnum } from '@/api/api';
import { Skeleton } from '@/components/base/ui/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { TFunction } from 'i18next';
import { Button } from '@/components/base/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import TableHeaderActions from '@/components/base/data-table/data-table-header-actions';

export interface TableColumnDef<TData, TValue> extends Omit<ColumnDef<TData, TValue>, 'id' | 'header'> {
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
  pinningPosition?: ColumnPinningPosition;
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
export function createColumnSettings(settings: BaseColumnSettings[]): ColumnSettings[] {
  return settings.map((setting, index) => ({
    ...setting,
    index,
  }));
}

/**
 * Read a settings config to produce an object with column visibility value
 * @param settings
 * @returns {
 *  column.id: visibility,
 * }
 */
function deserializeColumnVisibility(settings: ColumnSettings[]): ColumnVisiblity {
  const result: ColumnVisiblity = {};
  settings.forEach(setting => {
    result[setting.id] = setting.visible;
  });
  return result;
}

/**
 * Read a settings config to return column order (in asc)
 * @param settings
 * @returns [{ column.id: visibility }]
 */
function deserializeColumnOrder(settings: ColumnSettings[]): ColumnOrderState {
  return settings.sort((a, b) => a.index - b.index).map(setting => setting.id);
}

/**
 * Read a settings config to return isPinned value
 * @param settings
 * @returns
 */
function deserializeColumnPinning(settings: ColumnSettings[]): ColumnPinningState {
  const result: { left: string[]; right: string[] } = {
    left: [],
    right: [],
  };
  settings.forEach(setting => {
    if (setting.pinningPosition == 'left') {
      result.left.push(setting.id);
    } else if (setting.pinningPosition == 'right') {
      result.right.push(setting.id);
    }
  });
  return result;
}

/**
 * @param pagination
 * @param total
 */
function getPageCount(pagination: PaginationState, total: number) {
  return Math.ceil(total / pagination.pageSize);
}

/**
 * Return all extra tailwind class depending on column's context
 *
 * @fixme Tailwind or shadcn prevent us for using border. shadow-inset are used for the moment
 *        but this solution will not works when changing theme.
 *
 * @param column
 * @param extra
 * @returns
 */
function getColumnPinningExtraCN(column: Column<any>): string {
  const isPinned = column.getIsPinned();
  if (!isPinned) return '';
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return cn(
    isPinned && 'sticky z-10 bg-background',
    isLastLeftPinnedColumn && 'border-r',
    isFirstRightPinnedColumn && 'border-l',
  );
}

/**
 * Return the needed style to pin a column.
 * @see https://tanstack.com/table/v8/docs/framework/react/examples/column-pinning-sticky?panel=code
 * @param column
 * @returns
 */
function getCommonPinningStyles(column: Column<any>): CSSProperties {
  const isPinned = column.getIsPinned();
  if (!isPinned) return {};

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    width: column.getSize(),
  };
}

/**
 * Table
 *
 * @issue For full-width table, 'table-fixed` must be used Added in `<Table />` shadcn component
 * @link https://github.com/TanStack/table/issues/4825#issuecomment-1749665597
 *
 * @description `columns` define the mapping between the column and the cell component
 * @link https://tanstack.com/table/latest/docs/guide/column-defs#creating-accessor-columns
 *
 * @example
 * [
 *  columnHelper.accessor((row) => row.hgvsg, {
 *   id: "hgvsg",
 *   cell: (info) => info.getValue(),
 *   header: "Variant",
 *   size: 100,
 *   minSize: 50,
 *  })
 * ]
 * @description `columnSettings` (saved by user) and defaultColumnSettings manage order, visibility,
 *              fixed status of each column
 * @example
 *  [{
 *   "key": "{column.id}",
 *   "index": 16,
 *   "visible": {boolean},
 *   "fixed": {boolean},
 *  }]
 *
 * @description add a row selection checkbox for each row
 * @example
 * [{
 *  id: "row_selection",
 *  header: getTableRowSelectionHeader,
 *  cell: getTableRowSelectionCell,
 *  size: 70
 * }]
 * @description add a `RowExpandCell`, expand a custom subcomponent
 * @example
 * [{
 *  id: "row_expand",
 *  cell: RowExpandCell
 *  size: 48,
 * }]
 */
function DataTable<T>({
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
}: TableProps<T>) {
  // translations
  const { t } = useI18n();

  // default values
  const defaultTableState = useMemo(
    () => ({
      columnVisibility: deserializeColumnVisibility(defaultColumnSettings) ?? [],
      columnOrder: deserializeColumnOrder(defaultColumnSettings) ?? [],
      columnPinning: deserializeColumnPinning(defaultColumnSettings) ?? [],
    }),
    [defaultColumnSettings],
  );
  const userTableState = useMemo(
    () => ({
      columnVisiblity: deserializeColumnVisibility(columnSettings) ?? [],
      columnOrder: deserializeColumnOrder(columnSettings) ?? [],
      columnPinning: deserializeColumnPinning(columnSettings) ?? [],
    }),
    [columnSettings],
  );

  // container width
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // table interactions
  const [focusedHeaderId, setFocusedHeaderId] = useState<string>('');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisiblity>(userTableState.columnVisiblity);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(userTableState.columnOrder);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(userTableState.columnPinning);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Initialize tanstack table
  const table = useReactTable({
    columns,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    data: data,
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand: () => true,
    isMultiSortEvent: _e => true,
    manualPagination: true,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    onSortingChange: setSorting,
    onColumnPinningChange: setColumnPinning,
    pageCount: getPageCount(pagination, total),
    state: {
      columnOrder,
      columnVisibility,
      columnPinning,
      pagination,
      sorting,
    },
  });

  /*
   * Prevent calling of `column.getSize()` on every render
   * @see https://tanstack.com/table/v8/docs/framework/react/examples/column-resizing-performant
   */
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  /** @todo shout save column width in user data  */
  useResizeObserver(table.getState(), (columnId, columnSize) => {
    console.log(`Resize ${columnId} ${columnSize}`);
  });

  /**
   * Fix scrolling when a subcomponent is open
   */
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        setContainerWidth(newWidth);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

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
        sorting.map(s => ({
          field: s.id,
          order: s.desc ? SortBodyOrderEnum.Desc : SortBodyOrderEnum.Asc,
        })),
      );
    }

    onPaginationChange({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  }, [sorting]);

  return (
    <div className={cn('w-full', { 'absolute top-0 right-0 bottom-0 left-0 bg-white z-50 p-4': isFullscreen })}>
      <div className="w-full flex text-left justify-between items-center mb-2">
        <TableIndexResult
          loading={loadingStates?.total}
          pageIndex={table.getState().pagination.pageIndex + 1}
          pageSize={table.getState().pagination.pageSize}
          total={total}
        />

        <div>
          {/* columns order and visibility */}
          <TableColumnSettings
            columns={columns}
            defaultSettings={defaultColumnSettings}
            visiblitySettings={columnVisibility}
            handleVisiblityChange={(target: string, checked: boolean) => {
              setColumnVisibility({ ...columnVisibility, [target]: checked });
            }}
            handleOrderChange={setColumnOrder}
            pristine={JSON.stringify(defaultTableState) == JSON.stringify(userTableState)}
            handleReset={() => {
              setColumnOrder(defaultTableState.columnOrder);
              setColumnVisibility(defaultTableState.columnVisibility);
              setColumnPinning(defaultTableState.columnPinning);
            }}
          />
          {/* fullscreen toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" iconOnly onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize /> : <Maximize />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFullscreen ? t('common.table.fullscreen.minimize') : t('common.table.fullscreen.maximize')}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Table containerRef={containerRef} style={{ ...columnSizeVars }}>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={cn(getColumnPinningExtraCN(header.column))}
                  onMouseEnter={() => setFocusedHeaderId(header.column.id)}
                  style={{
                    width: `calc(var(--header-${header?.id}-size) * 1px)`,
                    ...getCommonPinningStyles(header.column),
                  }}
                >
                  <>
                    <div className="flex items-center gap-2">
                      {/* Header rendering */}
                      <div className="flex-1">{flexRender(header.column.columnDef.header, header.getContext())}</div>

                      {/* Table Header Actions */}
                      {focusedHeaderId === header.column.id && <TableHeaderActions header={header} />}
                    </div>

                    {/* Resize Grip */}
                    {header.column.getCanResize() && (
                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          'absolute top-0 h-full w-[4px] right-0 bg-black/50 cursor-col-resize select-none touch-none opacity-0 hover:opacity-50',
                          table.options.columnResizeDirection,
                          header.column.getIsResizing() ? 'opacity-100' : '',
                        )}
                      />
                    )}
                  </>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {/* Render skeleton loading */}
          {loadingStates?.list &&
            new Array(pagination.pageSize).fill(0).map((_, index) => (
              <TableRow key={`skeleton-row-${index}`}>
                <TableCell colSpan={columnSettings.length}>
                  <Skeleton className="w-full h-[32px]" />
                </TableCell>
              </TableRow>
            ))}

          {/* Render table content */}
          {!loadingStates?.list &&
            table.getRowModel().rows.map(row => (
              <Fragment key={row.id}>
                <TableRow key={`row-${row.id}`}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={cn('overflow-hidden truncate text-nowrap', getColumnPinningExtraCN(cell.column))}
                      onMouseEnter={() => setFocusedHeaderId(cell.column.id)}
                      style={{
                        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                        ...getCommonPinningStyles(cell.column),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {subComponent && row.getIsExpanded() && (
                  <TableRow key={`subcomponent-${row.id}`}>
                    <TableCell colSpan={row.getVisibleCells().length}>
                      <div className="sticky overflow-hidden left-2" style={{ width: containerWidth - 16 }}>
                        {subComponent(row.original)}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div>
          {/* PageSize select */}
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={value => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="min-w-[125px] h-8">
              <SelectValue>{table.getState().pagination.pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem key={`page-size-${pageSize}`} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
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
                <PaginationLink onClick={() => table.firstPage()}>1</PaginationLink>
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
