import { ColumnSettings, ColumnVisiblity, DefaultColumnTableState } from '@/components/base/data-table/data-table';
import { ColumnOrderState, ColumnPinningState, Row, RowPinningState, TableState } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';

export type TableCacheProps = {
  rowPinning: {
    rows: Row<any>[];
    state: RowPinningState;
  };
  columnSizing: {
    [key: string]: number;
  }[];
  pagination?: {
    pageSize: number;
  };
  columnVisibility: ColumnVisiblity;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
};

const DEFAULT_TABLE_CACHE: TableCacheProps = {
  rowPinning: {
    rows: [],
    state: {
      top: [],
      bottom: [],
    },
  },
  columnSizing: [],
  columnVisiblity: {},
  columnOrder: [],
  columnPinning: {},
};

type useTableStateObserverProps = {
  id: string;
  state: TableState;
  rows: Row<any>[];
  previousTableCache: TableCacheProps;
};

export function useTableStateObserver({ id, state, rows, previousTableCache }: useTableStateObserverProps) {
  const [tableCache, setTableCache] = useState<TableCacheProps>(previousTableCache);

  const columnResizeRef = useRef<string | false>(false);

  // column pin

  // pagination
  useEffect(() => {
    setTableCache({
      ...tableCache,
      pagination: {
        pageSize: state.pagination.pageSize,
      },
    });
  }, [state.pagination]);

  // column order
  useEffect(() => {
    console.log('-update-'); //TODO: to remove
    console.log('state.columnOrder', state.columnOrder); //TODO: to remove
    setTableCache({
      ...tableCache,
      columnOrder: state.columnOrder,
    });
  }, state.columnOrder);

  // resize
  useEffect(() => {
    if (state.columnSizingInfo && !state.columnSizingInfo?.isResizingColumn && columnResizeRef.current) {
      console.log(columnResizeRef.current);
      console.log(state.columnSizing[columnResizeRef.current]);
    }
    columnResizeRef.current = state.columnSizingInfo?.isResizingColumn;
  }, [state.columnSizingInfo, state.columnSizing]);

  // row pinning
  useEffect(() => {
    if (!state.rowPinning.top || !state.rowPinning.bottom) return;
    const index = [...new Set([...state.rowPinning.top, ...state.rowPinning.bottom])];
    setTableCache({
      ...tableCache,
      rowPinning: {
        rows: rows.filter(row => index.includes(row.id)),
        state: state.rowPinning,
      },
    });
  }, [state.rowPinning]);

  // visibility
  useEffect(() => {
    setTableCache({
      ...tableCache,
      columnVisibility: state.columnVisibility,
    });
  }, [state.columnVisibility]);

  // save to locale storage
  useEffect(() => {
    localStorage.setItem(id, JSON.stringify(tableCache));
  }, [tableCache]);
}

export function getTableCache(id: string, defaultTableState: DefaultColumnTableState) {
  const storage = localStorage.getItem(id);
  if (storage == null) {
    const defaultCache = { ...DEFAULT_TABLE_CACHE, ...defaultTableState };
    console.log('--- create a new cache ---');
    localStorage.setItem(id, JSON.stringify(defaultCache));
    return defaultCache;
  }

  return JSON.parse(storage);
}
