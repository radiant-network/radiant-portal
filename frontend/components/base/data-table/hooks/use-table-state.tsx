import { useEffect, useRef, useState } from 'react';
import { ColumnOrderState, ColumnPinningState, TableState } from '@tanstack/react-table';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { UserPreference } from '@/api/api';
import { userPreferenceApi } from '@/utils/api';

import { ColumnSettings, ColumnVisiblity, LoadingStates } from '../data-table';
import { TableObserverColumn, TableObserverProps } from '../type/data-table-type';
import { getFilteredAdditionalFields } from '../utils';

export enum DataTableState {
  PENDING,
  LOADING,
  ERROR,
  EMPTY,
  READY,
}

type useTableStateObserverProps = {
  id: string;
  columns: TableObserverColumn[];
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  columnSizing: Record<string, number>;
  columnVisibility: ColumnVisiblity;
};

type useTableStateFetchProps = {
  id: string;
  defaultColumnSettings: ColumnSettings[];
  setFetched: (value: boolean) => void;
  setColumnOrder: (value: ColumnOrderState) => void;
  setColumnPinning: (value: ColumnPinningState) => void;
  setColumnSizing: (value: Record<string, number>) => void;
  setColumnVisibility: (value: ColumnVisiblity) => void;
  setAdditionalFields?: (value: string[]) => void;
};

type useTableStateProps = {
  loadingStates: LoadingStates;
  isUserPreferenceFetched: boolean;
  hasError: boolean;
  isTableEmpty: boolean;
};

type useTableColumnSizingProps = {
  columns: TableObserverColumn[];
  state: TableState;
  setColumnSizing: (value: Record<string, number>) => void;
};

type FetchUserPreferenceInput = {
  key: string;
};

type PostUserPreferenceInput = FetchUserPreferenceInput & {
  userPreference: UserPreference;
};

/**
 * Get user preference
 */
async function fetchUserPreference(input: FetchUserPreferenceInput) {
  const response = await userPreferenceApi.getUserPreferences(input.key);
  return response.data;
}

/**
 * Post user preference
 */
async function postUserPreference(_url: string, { arg }: { arg: PostUserPreferenceInput }) {
  const response = await userPreferenceApi.postUserPreferences(arg.key, arg.userPreference);
  return response.data;
}

function getUserPreferenceKey(id: string) {
  return `data-table-${id}`;
}

/**
 * Merge a saved column pinning state with the default settings, adding any new
 * columns (absent from saved pinning) to their correct pin side.
 */
function mergeColumnPinning(savedPinning: ColumnPinningState, defaultSettings: ColumnSettings[]): ColumnPinningState {
  const result = {
    left: [...(savedPinning.left ?? [])],
    right: [...(savedPinning.right ?? [])],
  };
  defaultSettings.forEach(setting => {
    if (!setting.pinningPosition) return;
    const alreadyPinned = result.left.includes(setting.id) || result.right.includes(setting.id);
    if (alreadyPinned) return;
    if (setting.pinningPosition === 'left') result.left.push(setting.id);
    else if (setting.pinningPosition === 'right') result.right.push(setting.id);
  });
  return result;
}

/**
 * Merge a saved column order with the default settings, inserting any new
 * columns (absent from the saved order) at their correct default position.
 */
function mergeColumnOrder(savedOrder: string[], defaultSettings: ColumnSettings[]): string[] {
  const defaultOrder = [...defaultSettings].sort((a, b) => a.index - b.index).map(s => s.id);
  const newColumns = defaultOrder.filter(id => !savedOrder.includes(id));
  if (newColumns.length === 0) return savedOrder;

  const merged = [...savedOrder];
  newColumns.forEach(newId => {
    const defaultPos = defaultOrder.indexOf(newId);
    const predecessor = defaultOrder
      .slice(0, defaultPos)
      .reverse()
      .find(id => merged.includes(id));
    const insertAt = predecessor !== undefined ? merged.indexOf(predecessor) + 1 : 0;
    merged.splice(insertAt, 0, newId);
  });
  return merged;
}

/**
 * Load user preference
 * Will return an 404 if the config has never been set before
 * In that case, the data table falls back to its default configuration.
 */
export function useTableGetPreferenceEffect({
  id,
  defaultColumnSettings,
  setFetched,
  setColumnOrder,
  setColumnPinning,
  setColumnSizing,
  setColumnVisibility,
  setAdditionalFields,
}: useTableStateFetchProps) {
  const tableUserPreference = useSWR(
    `data-table-get-${id}`,
    () => fetchUserPreference({ key: getUserPreferenceKey(id) }),
    {
      revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (tableUserPreference.error) {
      setFetched(true);
    }
    if (tableUserPreference.data) {
      const tablePreference = tableUserPreference.data.content as TableObserverProps;
      setColumnOrder(mergeColumnOrder(tablePreference.columnOrder, defaultColumnSettings));
      setColumnPinning(mergeColumnPinning(tablePreference.columnPinning, defaultColumnSettings));
      setColumnSizing(tablePreference.columnSizing);
      setColumnVisibility(tablePreference.columnVisibility);
      setAdditionalFields?.(
        getFilteredAdditionalFields({ columnVisibility: tablePreference.columnVisibility, defaultColumnSettings }),
      );
      setFetched(true);
    }
  }, [tableUserPreference.isLoading, tableUserPreference.isValidating, tableUserPreference.data]);
}

/**
 * Update user-preference of the table with a POST request
 * A debounce of 350 is used to prevent multiple post when use onChange event of data-table
 */
export function useTableUpdatePreferenceEffect({
  id,
  columnOrder,
  columnPinning,
  columnSizing,
  columnVisibility,
}: useTableStateObserverProps) {
  const { trigger } = useSWRMutation(`data-table-post-${id}`, postUserPreference);

  useEffect(() => {
    const handler = setTimeout(() => {
      trigger({
        key: getUserPreferenceKey(id),
        userPreference: {
          content: {
            columnOrder,
            columnPinning,
            columnSizing,
            columnVisibility,
          },
          key: getUserPreferenceKey(id),
        },
      });
    }, 350);

    return () => {
      if (handler) clearTimeout(handler);
    };
  }, [columnPinning, columnOrder, columnSizing, columnVisibility]);
}

/**
 * Effect to serialize column size into a savable object
 * @example
 *  useTableSizingEffect({
 *    state: table.getState(),
 *    columns,
 *    setColumnSizing,
 *  });
 */
export function useTableSizingEffect({ state: tableState, columns, setColumnSizing }: useTableColumnSizingProps) {
  const columnResizeRef = useRef<string | false>(false);

  useEffect(() => {
    if (tableState.columnSizingInfo && !tableState.columnSizingInfo?.isResizingColumn && columnResizeRef.current) {
      const column = columns.find(column => column.id === columnResizeRef.current);
      let size = tableState.columnSizing[columnResizeRef.current];

      /**
       * Resize handle is linked to mouse input, it can
       * be released and return an invalid size of 0. This
       * prevent invalid value
       */
      if (column?.minSize && size < column.minSize) {
        size = column?.minSize;
      } else if (column?.maxSize && size > column.maxSize) {
        size = column.maxSize;
      }

      setColumnSizing({
        ...tableState.columnSizing,
        [columnResizeRef.current]: size,
      });
    }
    columnResizeRef.current = tableState.columnSizingInfo?.isResizingColumn;
  }, [tableState.columnSizingInfo, tableState.columnSizing]);
}

/**
 * Hook to manage global data-table state
 */
export function useTableState({ loadingStates, isUserPreferenceFetched, hasError, isTableEmpty }: useTableStateProps) {
  const [tableState, setTableState] = useState<DataTableState>(DataTableState.PENDING);

  useEffect(() => {
    if (loadingStates?.list || !isUserPreferenceFetched) {
      setTableState(DataTableState.LOADING);
    } else if (hasError) {
      setTableState(DataTableState.ERROR);
    } else if (isTableEmpty) {
      setTableState(DataTableState.EMPTY);
    } else {
      setTableState(DataTableState.READY);
    }
  }, [loadingStates, isUserPreferenceFetched, hasError, isTableEmpty]);

  return tableState;
}
