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
  Column,
  ColumnPinningPosition,
  ColumnPinningState,
  RowPinningState,
  Row,
  ExpandedState,
  getSortedRowModel,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import TableColumnSettings from '@/components/base/data-table/data-table-column-settings';
import TableIndexResult from '@/components/base/data-table/data-table-index-result';
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/base/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { SortBody, SortBodyOrderEnum } from '@/api/api';

import TableHeaderActions from '@/components/base/data-table/data-table-header-actions';
import {
  cleanTableLocaleStorage,
  getTableLocaleStorage,
  TableCacheProps,
  useTableStateObserver,
} from '@/components/base/data-table/hooks/use-table-localstorage';
import DataTableSkeletonLoading from '@/components/base/data-table/data-table-skeleton-loading';
import DataTableFullscreenButton from '@/components/base/data-table/data-table-fullscreen-button';
import Empty from '../empty';
import { Card } from '../ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { AlertCircle, SearchIcon } from 'lucide-react';

export const IS_SERVER = typeof window === 'undefined';

export interface TableColumnDef<TData, TValue> extends Omit<ColumnDef<TData, TValue>, 'id'> {
  id: string;
  subComponent?: string;
}

/**
 * Static value for header and row height
 * @note must be update if design change
 */
const HEADER_HEIGHT = 43;
const ROW_HEIGHT = 41;

/**
 * Interface and types
 */
type SubComponentProps<TData> = (data: TData) => React.JSX.Element;
type TableFiltersProps = ({ loading }: { loading: boolean }) => React.JSX.Element;

export type TableProps<TData> = {
  id: string;
  columns: TableColumnDef<TData, any>[];
  data: TData[];
  hasError?: boolean;
  defaultColumnSettings: ColumnSettings[];
  defaultServerSorting: SortBody[];
  loadingStates?: {
    total?: boolean;
    list?: boolean;
  };
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  onServerSortingChange?: (sorting: SortBody[]) => void;
  subComponent?: SubComponentProps<TData>;
  TableFilters?: TableFiltersProps;
  total?: number;
  enableColumnOrdering?: boolean;
  enableFullscreen?: boolean;
  tableIndexResultPosition?: 'top' | 'bottom' | 'hidden';
};

export interface BaseColumnSettings {
  id: string;
  visible: boolean;
  fixed?: boolean;
  size?: number;
  pinningPosition?: ColumnPinningPosition;
  header?: string;
  label?: string;
}

export interface ColumnSettings extends BaseColumnSettings {
  index: number;
  header?: string;
}

export type ColumnVisiblity = {
  [id: string]: boolean;
};

export type DefaultColumnTableState = {
  columnVisibility: ColumnVisiblity;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
};

/**
 * Automate index creation for column settings
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
 * Return the needed tailwind class to pin a column. Must be applied to <TableCell />
 *
 */
function getColumnPinningExtraCN(column: Column<any>): string {
  const isPinned = column.getIsPinned();
  if (!isPinned) return '';
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return cn({
    'sticky z-10 bg-background group-data-[state=selected]:bg-table-active': isPinned,
    'border-r': isLastLeftPinnedColumn,
    'border-l': isFirstRightPinnedColumn,
  });
}

/**
 * Return the needed style to pin a column. Must be applied to <TableCell />
 * @see https://tanstack.com/table/v8/docs/framework/react/examples/column-pinning-sticky?panel=code
 */
function getColumnPinningExtraStyles(column: Column<any>): CSSProperties {
  const isPinned = column.getIsPinned();
  if (!isPinned) return {};

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    width: column.getSize(),
  };
}

/**
 * Return the needed tailwind class to pin a row. Must be applied to <TableRow />
 */
function getRowPinningExtraCN(row: Row<any>): string {
  const isPinned = row.getIsPinned();
  if (!isPinned) return '';

  return cn({ 'sticky z-20 bg-muted': isPinned });
}

/**
 * Return the needed style to pin a row. Must be applied to <TableRow />
 * @see https://tanstack.com/table/v8/docs/framework/react/examples/row-pinning
 */
function getRowPinningExtraStyles(row: Row<any>): CSSProperties {
  const isPinned = row.getIsPinned();
  if (!isPinned) return {};

  return {
    top: `${row.getPinnedIndex() * ROW_HEIGHT + HEADER_HEIGHT}px`,
  };
}

/**
 * Return the needed tailwind class to pin a row. Must be applied to <TableCell />
 */
function getRowPinningCellExtraCN(row: Row<any>): string {
  const isPinned = row.getIsPinned();
  if (!isPinned) return '';

  return cn({ 'bg-muted': isPinned });
}

/**
 * Reusable flex row function
 * Used to render top, centered or bottom rows
 */
function getRowFlexRender<T>({
  subComponent,
  containerWidth,
}: {
  subComponent?: SubComponentProps<T>;
  containerWidth: number;
}) {
  return function (row: Row<any>) {
    return (
      <Fragment key={row.id}>
        <TableRow
          key={`row-${row.id}`}
          className={cn(getRowPinningExtraCN(row))}
          style={{
            ...getRowPinningExtraStyles(row),
          }}
          data-state={row.getIsSelected() && 'selected'}
        >
          {row.getVisibleCells().map(cell => (
            <TableCell
              key={cell.id}
              className={cn(
                'overflow-hidden truncate text-nowrap',
                getColumnPinningExtraCN(cell.column),
                getRowPinningCellExtraCN(cell.row),
              )}
              style={{
                width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                ...getColumnPinningExtraStyles(cell.column),
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
        {subComponent && row.getIsExpanded() && (
          <TableRow key={`subcomponent-${row.id}`} className="bg-muted/30">
            <TableCell colSpan={row.getVisibleCells().length}>
              <div className="sticky overflow-hidden left-2" style={{ width: containerWidth - 16 }}>
                {subComponent(row.original)}
              </div>
            </TableCell>
          </TableRow>
        )}
      </Fragment>
    );
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
 *  id: "pinRow",
 *  cell: PinRowCell,
 *  size: 52,
 *  enableResizing: false,
 *  enablePinning: false,
 * }]*
 * @description add a row selection checkbox for each row
 * @example
 * [{
 *  id: "rowSelection",
 *  header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
 *  cell: info => <RowSelectionCell row={info.row} />,
 *  size: 48,
 *  maxSize: 48,
 *  enableResizing: false,
 *  enablePinning: false,
 * }]
 * @description add a `RowExpandCell`, expand a custom subcomponent
 * @example
 * [{
 *  id: "rowExpand",
 *  cell: RowExpandCell
 *  size: 48,
 *  enableResizing: false,
 *  enablePinning: false,
 * }]
 */
function TranstackTable<T>({
  id,
  columns,
  data,
  defaultColumnSettings,
  defaultServerSorting,
  TableFilters: FiltersGroupForm,
  loadingStates = {
    total: true,
    list: true,
  },
  hasError = false,
  pagination,
  onPaginationChange,
  onServerSortingChange,
  subComponent,
  total = 0,
  enableColumnOrdering = false,
  enableFullscreen = false,
  tableIndexResultPosition = 'top',
}: TableProps<T>) {
  const { t } = useI18n();

  // default values
  const defaultColumnTableState = useMemo<DefaultColumnTableState>(
    () => ({
      columnOrder: deserializeColumnOrder(defaultColumnSettings) ?? {},
      columnPinning: deserializeColumnPinning(defaultColumnSettings) ?? {},
      columnSizing: {}, // keep empty, data means the column has been resized
      columnVisibility: deserializeColumnVisibility(defaultColumnSettings) ?? [],
    }),
    [defaultColumnSettings],
  );

  /**
   * Load the previous table state
   * @todo should be replaced by userApi
   */
  const tableLocaleStorage: TableCacheProps = getTableLocaleStorage(id, columns, defaultColumnTableState);

  // container width
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // table interactions
  const [isTableEmpty, setIsTableEmpty] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [rowPinning, setRowPinning] = useState<RowPinningState>(tableLocaleStorage.rowPinning.state);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisiblity>(tableLocaleStorage.columnVisibility);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(tableLocaleStorage.columnOrder);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(tableLocaleStorage.columnPinning);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [sorting, setSorting] = useState<SortingState>(
    defaultServerSorting.map(serverSorting => ({
      id: serverSorting.field,
      desc: serverSorting.order === SortBodyOrderEnum.Desc,
    })) as SortingState,
  );

  // Initialize tanstack table
  const table = useReactTable({
    columns: columns.map(column => {
      // load saved size
      if (tableLocaleStorage.columnSizing[column.id]) {
        return {
          ...column,
          size: tableLocaleStorage.columnSizing[column.id],
        };
      }
      return column;
    }),
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    data,
    enableColumnResizing: true,
    getSortedRowModel: onServerSortingChange === undefined ? getSortedRowModel() : undefined, //client-side sorting
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand: () => true,
    isMultiSortEvent: _e => true,
    keepPinnedRows: false, // prevent crash from pinning row until we have userApi save options
    manualPagination: true,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onPaginationChange,
    onRowPinningChange: setRowPinning,
    onSortingChange: setSorting,
    pageCount: getPageCount(pagination, total),
    state: {
      columnOrder,
      columnVisibility,
      columnPinning,
      pagination,
      expanded,
      rowPinning,
      sorting,
    },
  });

  // Cache our row flexRender method
  const rowFlexRender = useMemo(() => {
    return getRowFlexRender<T>({ subComponent, containerWidth });
  }, [subComponent, containerWidth]);

  /*
   * Prevent calling of `column.getSize()` on every render
   * @see https://tanstack.com/table/latest/docs/framework/react/examples/column-resizing-performant
   *
   * Must be re-calculated when columnVisibility changes
   */
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    headers.forEach(header => {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    });
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing, columnVisibility]);

  /**
   * Sync table state with local storage
   * Table Cache is to live result of each table interaction
   */
  const { tableCache, setTableCache } = useTableStateObserver({
    id,
    state: table.getState(),
    rows: table.getRowModel().rows,
    previousTableCache: tableLocaleStorage,
  });

  /**
   * Fix scrolling when a subcomponent is open by setting a containerWidth
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
   * No result found
   */
  useEffect(() => {
    if (loadingStates?.list === false) {
      setIsTableEmpty(table.getRowCount() === 0);
    }
  }, [loadingStates?.list]);

  useEffect(() => {
    setIsTableEmpty(table.getRowCount() === 0);
  }, [table.getRowCount()]);

  /**
   * Sorting useEffect
   * Update server-side calls to use the new sorting settings
   * Reset pagination at the same time
   */
  useEffect(() => {
    if (!onServerSortingChange) return;
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

    setExpanded({});

    onPaginationChange({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  }, [sorting]);

  /**
   * Reset expanded sub-component on pagination change
   */
  useEffect(() => {
    setExpanded({});
  }, [pagination]);

  const hasUpperSettings = tableIndexResultPosition === 'top' || enableColumnOrdering || enableFullscreen;

  return (
    <div
      className={cn('w-full', {
        'absolute top-0 right-0 bottom-0 left-0 bg-white z-50 p-4 overflow-y-scroll': isFullscreen,
      })}
    >
      <div className={cn('w-full flex text-left justify-between items-end', { 'mb-4': hasUpperSettings })}>
        {/* Total */}

        {tableIndexResultPosition === 'top' && (
          <div className="flex">
            <TableIndexResult
              loading={loadingStates?.total}
              pageIndex={table.getState().pagination.pageIndex + 1}
              pageSize={table.getState().pagination.pageSize}
              total={total}
            />
          </div>
        )}

        {/* FiltersGroup */}
        {FiltersGroupForm && FiltersGroupForm({ loading: loadingStates?.list ?? true })}

        {/* Right Menu Options */}
        <div className="flex justify-end">
          {enableColumnOrdering && (
            <>
              {/* columns order and visibility */}
              <TableColumnSettings
                loading={loadingStates?.list}
                columnPinning={tableCache.columnPinning}
                columnOrder={tableLocaleStorage.columnOrder}
                defaultSettings={defaultColumnSettings}
                visiblitySettings={columnVisibility}
                handleVisiblityChange={(target: string, checked: boolean) => {
                  setColumnVisibility({ ...columnVisibility, [target]: checked });
                }}
                handleOrderChange={setColumnOrder}
                pristine={
                  JSON.stringify(defaultColumnTableState) ==
                  JSON.stringify({
                    columnOrder: tableCache.columnOrder,
                    columnPinning: tableCache.columnPinning,
                    columnSizing: tableCache.columnSizing,
                    columnVisibility: tableCache.columnVisibility,
                  })
                }
                handleReset={() => {
                  cleanTableLocaleStorage(id, defaultColumnTableState, setTableCache);
                  setColumnOrder(defaultColumnTableState.columnOrder);
                  setColumnVisibility(defaultColumnTableState.columnVisibility);
                  setColumnPinning(defaultColumnTableState.columnPinning);
                  table.resetColumnSizing();
                  table.resetHeaderSizeInfo();
                }}
              />
            </>
          )}

          {/* fullscreen toggle */}
          {enableFullscreen && (
            <DataTableFullscreenButton
              loading={loadingStates?.list}
              active={isFullscreen}
              handleClick={setIsFullscreen}
            />
          )}
        </div>
      </div>

      {/* Skeleton */}
      {loadingStates?.list === true && (
        <DataTableSkeletonLoading
          headerGroups={table.getHeaderGroups()}
          pagination={pagination}
          columnSettings={defaultColumnSettings}
        />
      )}

      {/* Empty State */}
      {loadingStates?.list === false && !hasError && isTableEmpty && (
        <Card className="shadow-none">
          <Empty
            title={t('common.table.no_result')}
            description={t('common.table.no_result_description')}
            size="default"
            iconType="custom"
            icon={SearchIcon}
          />
        </Card>
      )}

      {/* Error state */}
      {loadingStates?.list === false && hasError && (
        <Card className="w-full shadow-none">
          <Empty
            title={t('common.table.has_error')}
            description={t('common.table.has_error_description')}
            size="default"
            iconType="custom"
            icon={AlertCircle}
          />
        </Card>
      )}

      {loadingStates?.list === false && !hasError && !isTableEmpty && (
        <div ref={containerRef}>
          <Table id={id} style={{ ...columnSizeVars }}>
            <TableHeader className={cn({ 'sticky top-0 bg-background z-20': table.getTopRows().length > 0 })}>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className={cn('group/header', getColumnPinningExtraCN(header.column))}
                      style={{
                        width: `calc(var(--header-${header?.id}-size) * 1px)`,
                        ...getColumnPinningExtraStyles(header.column),
                      }}
                    >
                      <>
                        <div className="flex items-center justify-between gap-1">
                          {/* Header rendering */}
                          <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>

                          {/* Table Header Actions, only display on hover */}
                          <TableHeaderActions header={header} />
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
              {/* Render pinned rows */}
              {table.getTopRows().map(rowFlexRender)}

              {/* Render table content */}
              {table.getCenterRows().map(rowFlexRender)}
            </TableBody>
          </Table>
        </div>
      )}
      {total > 10 && (
        <div className={'flex items-center justify-between py-3 '}>
          <div>
            {tableIndexResultPosition === 'bottom' && (
              <TableIndexResult
                loading={loadingStates?.total}
                pageIndex={table.getState().pagination.pageIndex + 1}
                pageSize={table.getState().pagination.pageSize}
                total={total}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
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
                    <PaginationFirst disabled={!table.getCanPreviousPage()} onClick={() => table.firstPage()} />
                  </PaginationItem>
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
      )}
    </div>
  );
}

/**
 * Tanstack can cause some side effects with SSR when using
 * - localStorage
 * - loading and resize columns
 *
 * @fixme to be disabled when using userApi to see if the same issues happens
 */
function DataTable<T>(props: TableProps<T>) {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (IS_SERVER || !isClient) return null;

  return <TranstackTable {...props} />;
}

export default DataTable;
