import { ColumnVisiblity, DefaultColumnTableState } from '@/components/base/data-table/data-table';
import {
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  Row,
  RowPinningState,
  TableState,
} from '@tanstack/react-table';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

export type TableCacheProps = {
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  columnSizing: ColumnSizingState;
  columnVisibility: ColumnVisiblity;
  rowPinning: {
    rows: Row<any>[];
    state: RowPinningState;
  };
  pagination?: {
    pageSize: number;
  };
};

const DEFAULT_TABLE_CACHE: TableCacheProps = {
  columnOrder: [],
  columnPinning: {},
  columnSizing: {},
  columnVisibility: {},
  rowPinning: {
    rows: [],
    state: {
      top: [],
      bottom: [],
    },
  },
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

  // column pinning
  useEffect(() => {
    setTableCache({
      ...tableCache,
      columnPinning: state.columnPinning,
    });
  }, [state.columnPinning]);

  // pagination
  /** @fixme doesn't works, usefull ? How to make it works before the first call */
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
    setTableCache({
      ...tableCache,
      columnOrder: state.columnOrder,
    });
  }, state.columnOrder);

  // column sizing
  useEffect(() => {
    if (state.columnSizingInfo && !state.columnSizingInfo?.isResizingColumn && columnResizeRef.current) {
      setTableCache({
        ...tableCache,
        columnSizing: state.columnSizing,
      });
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

  return { tableCache, setTableCache };
}

export function getTableLocaleStorage(id: string, defaultColumnTableState: DefaultColumnTableState) {
  const storage = localStorage.getItem(id);
  if (storage == null) {
    const defaultCache = { ...DEFAULT_TABLE_CACHE, ...defaultColumnTableState };
    localStorage.setItem(id, JSON.stringify(defaultCache));
    return defaultCache;
  }

  return JSON.parse(storage);
}

export function cleanTableLocaleStorage(
  id: string,
  defaultColumnTableState: DefaultColumnTableState,
  setTableCache: Dispatch<SetStateAction<TableCacheProps>>,
) {
  localStorage.setItem(id, JSON.stringify({ ...DEFAULT_TABLE_CACHE, ...defaultColumnTableState }));
  setTableCache({ ...DEFAULT_TABLE_CACHE, ...defaultColumnTableState });
}
