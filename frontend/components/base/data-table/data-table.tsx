import { CSSProperties, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  Column,
  ColumnDef,
  ColumnOrderState,
  ColumnPinningPosition,
  ColumnPinningState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  GroupingState,
  Header,
  OnChangeFn,
  PaginationState,
  Row,
  RowPinningState,
  SortingState,
  Table as TableType,
  useReactTable,
} from '@tanstack/react-table';
import { AlertCircle, ChevronDown, ChevronRight, SearchIcon } from 'lucide-react';

import { SortBody, SortBodyOrderEnum } from '@/api/api';
import TableColumnSettings from '@/components/base/data-table/data-table-column-settings';
import DataTableFullscreenButton from '@/components/base/data-table/data-table-fullscreen-button';
import TableHeaderActions from '@/components/base/data-table/data-table-header-actions';
import TableIndexResult from '@/components/base/data-table/data-table-index-result';
import DataTableSkeletonLoading from '@/components/base/data-table/data-table-skeleton-loading';
import {
  cleanTableLocaleStorage,
  getTableLocaleStorage,
  TableCacheProps,
  useTableStateObserver,
} from '@/components/base/data-table/hooks/use-table-localstorage';
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationNext,
  PaginationPageSize,
  PaginationPrevious,
} from '@/components/base/ui/pagination';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/base/ui/table';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/lib/utils';

import Empty from '../empty';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

import DataTableGroupBy from './data-table-group-by';
import { getFilteredAdditionalFields, updateAdditionalField } from './utils';

export const IS_SERVER = typeof window === 'undefined';

export interface TableColumnDef<TData, TValue> extends Omit<ColumnDef<TData, TValue>, 'id'> {
  id: string;
  subComponent?: string;
}

/**
 * Static value for header and row height
 * @note must be update if design change
 */
export const HEADER_HEIGHT = 43;
export const ROW_HEIGHT = 41;

/**
 * Interface and types
 */
type SubComponentProps<TData> = (data: TData) => React.JSX.Element;

type PaginationSettings = {
  type: 'server' | 'locale' | 'hidden';
  state?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
};

type ServerOptions = {
  setAdditionalFields?: (fields: string[]) => void;
  defaultSorting: SortBody[];
  onSortingChange?: (sorting: SortBody[]) => void;
};

export type TableProps<TData> = {
  id: string;
  columns: TableColumnDef<TData, any>[];
  className?: string;
  data: TData[];
  hasError?: boolean;
  defaultColumnSettings: ColumnSettings[];
  loadingStates?: {
    total?: boolean;
    list?: boolean;
  };
  subComponent?: SubComponentProps<TData>;
  TableFilters?: React.JSX.Element;
  total?: number;
  enableColumnOrdering?: boolean;
  enableFullscreen?: boolean;
  tableIndexResultPosition?: 'top' | 'bottom' | 'hidden';
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: OnChangeFn<Record<string, boolean>>;
  pagination: PaginationSettings;
  serverOptions: ServerOptions;
};

export interface BaseColumnSettings {
  id: string;
  visible: boolean;
  fixed?: boolean;
  size?: number;
  pinningPosition?: ColumnPinningPosition;
  header?: string;
  label?: string;
  additionalFieldIds?: string[];
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
    'sticky z-10 group-data-[state=selected]:bg-table-active': isPinned,
    'border-r-[3px]': isLastLeftPinnedColumn,
    'border-l-[3px]': isFirstRightPinnedColumn,
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
 * Reusable flex header function
 * Used to render header group and header
 */
function getHeaderFlexRender(table: TableType<any>, header: Header<any, any>) {
  if (header.isPlaceholder) return null;

  return (
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
  );
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
              <>
                {/* Group By */}
                {cell.getIsGrouped() && (
                  <Button
                    className="self-center"
                    size="xs"
                    variant="ghost"
                    iconOnly
                    onClick={row.getToggleExpandedHandler()}
                  >
                    {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
                  </Button>
                )}

                {/* Group By: Aggregated */}
                {cell.getIsAggregated() &&
                  flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())}

                {/* Placeholder OR normal rendering */}
                {!cell.getIsAggregated() &&
                  !cell.getIsPlaceholder() &&
                  flexRender(cell.column.columnDef.cell, cell.getContext())}
              </>
            </TableCell>
          ))}
        </TableRow>

        {/* SubComponent */}
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
 * Data-Table
 * Should be used for complex and interactive table.
 * @SEE: If you needs to only display data in a table without interaction, local storage or pagination,
 * use DisplayTable instead
 * @SEE: Storybook provide an example of all custom cell
 
 * @ISSUE: For full-width table, 'table-fixed` must be used Added in `<Table />` shadcn component
 * @LINK: https://github.com/TanStack/table/issues/4825#issuecomment-1749665597
 *
 * @DESCRIPTION: `columns` define the mapping between the column and the cell component
 * @LINK: https://tanstack.com/table/latest/docs/guide/column-defs#creating-accessor-columns
 * @EXAMPLE:
 *  [
 *   columnHelper.accessor((row) => row.hgvsg, {
 *    id: "hgvsg",
 *    cell: (info) => info.getValue(),
 *    header: "Variant",
 *    size: 100,
 *    minSize: 50,
 *   })
 *  ]
 * @DESCRIPTION: `columnSettings` (saved by user) and defaultColumnSettings manage order, visibility,
 *              fixed status of each column
 * @EXAMPLE:
 *  [{
 *   "key": "{column.id}",
 *   "index": 16,
 *   "visible": {boolean},
 *   "fixed": {boolean},
 *  }]
 *
 * @DESCRIPTION: add a row selection checkbox for each row
 * @EXAMPLE:
 *  [{
 *   id: "pinRow",
 *   cell: PinRowCell,
 *   size: 52,
 *   enableResizing: false,
 *   enablePinning: false,
 *  }]*
 *
 * @DESCRIPTION: add a row selection checkbox for each row
 * @EXAMPLE:
 *  [{
 *   id: "rowSelection",
 *   header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
 *   cell: info => <RowSelectionCell row={info.row} />,
 *   size: 48,
 *   maxSize: 48,
 *   enableResizing: false,
 *   enablePinning: false,
 *  }]
 *
 * @DESCRIPTION: add a `RowExpandCell`, expand a custom subcomponent
 * @EXAMPLE:
 *  [{
 *   id: "rowExpand",
 *   cell: RowExpandCell
 *   size: 48,
 *   enableResizing: false,
 *   enablePinning: false,
 *  }]
 *
 * @DESCRIPTION: enable groupBy for a columns.
 *               Accessor must have an id.
 *               DropdownMenuItem label's is created with defaultColumnSettings
 * @EXAMPLE:
 *  [{
 *   columnHelper.accessor('status', {
 *     id: "status",
 *     header: 'Status',
 *     getGroupingValue: row => `Group By ${row.status}`,
 *     enableGrouping: true,
 *   }),
 *  }]*
 *
 * @DESCRIPTION: enable column group.
 *               Use columnHelper.group
 *               @see: https://tanstack.com/table/latest/docs/framework/react/examples/column-groups
 * @EXAMPLE:
 *  columnHelper.group({
 *      id: 'group',
 *      columns: [
 *        // Row 1
 *        columnHelper.accessor(row => row.value, { ... }),
 *      ],
 *    }),
 *  }]
 *
 * @DESCRIPTION: pagination prop manage the pagination mode and state
 *                For client side pagination, set type to 'locale' and provide state if override is needed
 *                For server side pagination, set type to 'server' and provide state and onPaginationChange handler
 * @EXAMPLE: {
 *   type: 'server',
 *   state: {
 *     pageIndex: 0,
 *     pageSize: 10,
 *   },
 *  onPaginationChange: (newPagination) => { ... },
 * } 
 * 
 * @DESCRIPTION: additional fields are managed by the table to be able to request extra data from server
 *              based on the column visibility.
 * @EXAMPLE: {
 *   additional_fields: ['field1', 'field2'],
 * }
 */
// eslint-disable-next-line complexity
function TranstackTable<T>({
  id,
  columns,
  className,
  data,
  defaultColumnSettings,
  TableFilters,
  loadingStates = {
    total: true,
    list: true,
  },
  hasError = false,
  pagination,
  subComponent,
  total = 0,
  enableColumnOrdering = false,
  enableFullscreen = false,
  tableIndexResultPosition = 'top',
  rowSelection,
  onRowSelectionChange,
  serverOptions,
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
   * @TODO: should be replaced by userApi
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
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [sorting, setSorting] = useState<SortingState>(
    serverOptions.defaultSorting.map(serverSorting => ({
      id: serverSorting.field,
      desc: serverSorting.order === SortBodyOrderEnum.Desc,
    })) as SortingState,
  );
  const [internalRowSelection, setInternalRowSelection] = useState<Record<string, boolean>>(rowSelection ?? {});

  // Default internal pagination state for locale and server pagination
  const [internalPagination, setInternalPagination] = useState<PaginationState>(() => ({
    pageIndex: pagination.state?.pageIndex || 0,
    pageSize: pagination.state?.pageSize || 10,
  }));

  // Synchronyze internal pagination with props state
  useEffect(() => {
    if (pagination.type !== 'hidden' && pagination.state) {
      setInternalPagination(pagination.state);
    }
  }, [pagination.state, pagination.type]);

  // Key Input Map
  const handleEscEventListener = () => {
    setIsFullscreen(false);
  };

  // Set only additional fields displayed in the table
  const filteredAdditionalFields = useMemo(
    () =>
      getFilteredAdditionalFields({
        columnVisibility,
        defaultColumnSettings,
      }),
    [columnVisibility],
  );

  // Ref to update only if additional fields change
  const lastFilteredAdditionalFields = useRef<string[]>([]);

  useEffect(() => {
    updateAdditionalField({
      newAddFields: filteredAdditionalFields,
      prevAddFields: lastFilteredAdditionalFields,
      setAdditionalFields: serverOptions.setAdditionalFields,
    });
  }, []);

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
    enableRowSelection: true,
    getSortedRowModel: serverOptions.onSortingChange === undefined ? getSortedRowModel() : undefined, //client-side sorting
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getPaginationRowModel: pagination.type === 'hidden' ? undefined : getPaginationRowModel(),
    getRowCanExpand: () => true,
    isMultiSortEvent: () => true,
    keepPinnedRows: false, // prevent crash from pinning row until we have userApi save options
    manualPagination: pagination.type === 'server',
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onGroupingChange: setGrouping,
    onPaginationChange: (() => {
      if (pagination.type === 'hidden') return undefined;
      if (pagination.type === 'locale') return setInternalPagination;
      return pagination.onPaginationChange;
    })(),
    onRowPinningChange: setRowPinning,
    onRowSelectionChange: onRowSelectionChange || setInternalRowSelection,
    onSortingChange: setSorting,
    pageCount: pagination.state && pagination.type === 'server' ? getPageCount(pagination.state, total) : undefined,
    state: {
      columnOrder,
      columnVisibility,
      columnPinning,
      grouping,
      pagination: (() => (pagination.type !== 'hidden' ? internalPagination : undefined))(),
      expanded,
      rowPinning,
      rowSelection: onRowSelectionChange ? rowSelection : internalRowSelection,
      sorting,
    },
  });

  const groupByColumns = columns.filter(column => column.enableGrouping);

  /**
   * Cache our row flexRender method
   */
  const rowFlexRender = useMemo(
    () => getRowFlexRender<T>({ subComponent, containerWidth }),
    [subComponent, containerWidth],
  );

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

  // Table Index display position
  const hasUpperSettings = tableIndexResultPosition === 'top' || enableColumnOrdering || enableFullscreen;

  // Footer, check if any columns have footer definitions
  const footerGroups = table.getFooterGroups();
  const hasFooterDefinitions = useMemo(() => columns.some(column => column.footer !== undefined), [columns]);

  // Determine if pagination should be hidden based on data size vs total
  const shouldHidePagination = useMemo(() => {
    if (pagination.type === 'hidden') return true;

    const pageSize = pagination.state?.pageSize || 20;

    // For client side pagination, we base it on the local data
    if (pagination.type === 'locale') {
      return data.length <= pageSize;
    }

    // Hide pagination if data rows are fewer than total records
    return total < (pageSize || 20);
  }, [pagination.type, pagination.state?.pageSize, total, data.length]);

  /**
   * Add 'Esc' keyboard shortcut for fullscreen mode
   */
  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscEventListener);
    }

    return () => {
      document.removeEventListener('keydown', handleEscEventListener);
    };
  }, [isFullscreen]);

  /**
   * Fix scrolling when a subcomponent is open by setting a containerWidth
   */
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
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
   * Manage Empty State
   */
  useEffect(() => {
    setIsTableEmpty(table.getRowCount() === 0 && data.length === 0);
  }, [table.getRowCount(), data.length]);

  /**
   * Sorting useEffect
   * Update server-side calls to use the new sorting settings
   * Reset pagination at the same time
   */
  useEffect(() => {
    if (!serverOptions.onSortingChange) return;
    if (sorting.length === 0) {
      serverOptions.onSortingChange(serverOptions.defaultSorting);
    } else {
      serverOptions.onSortingChange(
        sorting
          .map(s => ({
            field: s.id,
            order: s.desc ? SortBodyOrderEnum.Desc : SortBodyOrderEnum.Asc,
          }))
          .reverse(),
      );
    }

    setExpanded({});

    if (pagination.type !== 'hidden' && pagination.onPaginationChange) {
      pagination.onPaginationChange({
        pageIndex: 0,
        pageSize: pagination.state?.pageSize || 20,
      });
    }
  }, [sorting]);

  /**
   * Reset expanded sub-component on pagination change
   */
  useEffect(() => {
    if (pagination.type !== 'hidden') {
      setExpanded({});
    }
  }, [pagination.state, pagination.type]);

  /**
   * Sync internal row selection with prop when it changes
   */
  useEffect(() => {
    if (rowSelection && !onRowSelectionChange) {
      setInternalRowSelection(rowSelection);
    }
  }, [rowSelection, onRowSelectionChange]);

  return (
    <div
      className={cn('w-full', className, {
        'absolute top-0 right-0 bottom-0 left-0 bg-background z-50 p-4 overflow-y-scroll': isFullscreen,
      })}
    >
      <div className={cn('w-full flex text-left justify-between items-end', { 'mb-4': hasUpperSettings })}>
        {/* Total */}
        {tableIndexResultPosition === 'top' && (
          <div className={cn('flex-1', { invisible: shouldHidePagination })}>
            <TableIndexResult
              loading={loadingStates?.total}
              pageIndex={(table.getState().pagination?.pageIndex ?? 0) + 1}
              pageSize={table.getState().pagination?.pageSize ?? 20}
              total={total}
            />
          </div>
        )}

        {/* FiltersGroup */}
        {TableFilters}

        {/* Right Menu Options */}
        <div className="flex justify-end">
          {/* GroupBy */}
          {groupByColumns.length > 0 && (
            <DataTableGroupBy
              grouping={grouping}
              table={table}
              groupByColumns={groupByColumns}
              defaultColumnSettings={defaultColumnSettings}
            />
          )}

          {/* columns order and visibility */}
          {enableColumnOrdering && (
            <>
              <TableColumnSettings
                loading={loadingStates?.list}
                columnPinning={tableCache.columnPinning}
                columnOrder={tableLocaleStorage.columnOrder}
                defaultSettings={defaultColumnSettings}
                visiblitySettings={columnVisibility}
                handleVisiblityChange={(target: string, checked: boolean) => {
                  setColumnVisibility({ ...columnVisibility, [target]: checked });
                  const newAdditionalFields = getFilteredAdditionalFields({
                    columnVisibility: { ...columnVisibility, [target]: checked },
                    defaultColumnSettings,
                  });
                  updateAdditionalField({
                    newAddFields: newAdditionalFields,
                    prevAddFields: lastFilteredAdditionalFields,
                    setAdditionalFields: serverOptions.setAdditionalFields,
                  });
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
                  const allAdditionalFields = getFilteredAdditionalFields({
                    columnVisibility: defaultColumnTableState.columnVisibility,
                    defaultColumnSettings,
                  });
                  serverOptions.setAdditionalFields?.(allAdditionalFields);
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
          pagination={pagination.state || { pageIndex: 0, pageSize: 20 }}
          columnSettings={defaultColumnSettings}
        />
      )}

      {/* Empty State */}
      {loadingStates?.list === false && !hasError && isTableEmpty && (
        <Card className="shadow-none">
          <Empty
            title={t('common.table.no_result')}
            description={t('common.table.no_result_description')}
            iconType="custom"
            icon={SearchIcon}
            size="mini"
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

      <div ref={containerRef}>
        {loadingStates?.list === false && !hasError && !isTableEmpty && (
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
                      colSpan={header.colSpan}
                    >
                      {getHeaderFlexRender(table, header)}
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
            {hasFooterDefinitions && (
              <TableFooter>
                {footerGroups.map(footerGroup => (
                  <TableRow key={footerGroup.id}>
                    {footerGroup.headers.map(header => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableFooter>
            )}
          </Table>
        )}
      </div>
      {!shouldHidePagination && (
        <div className={'flex items-center justify-between py-3 '}>
          <div>
            {tableIndexResultPosition === 'bottom' && (
              <TableIndexResult
                loading={loadingStates?.total}
                pageIndex={(table.getState().pagination?.pageIndex ?? 0) + 1}
                pageSize={table.getState().pagination?.pageSize ?? 20}
                total={total}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <div>
              {/* PageSize select */}
              <PaginationPageSize
                pageSize={table.getState().pagination?.pageSize ?? 20}
                onPageSizeChange={pageSize => {
                  table.setPageSize(pageSize);
                }}
              />
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
