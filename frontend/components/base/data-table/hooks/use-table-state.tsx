import { useEffect, useRef } from 'react';
import { ColumnOrderState, ColumnPinningState, TableState } from '@tanstack/react-table';
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';

import { UserPreference } from '@/api/api';
import { userPreferenceApi } from '@/utils/api';

import { ColumnSettings, ColumnVisiblity } from '../data-table';
import { TableObserverColumn, TableObserverProps } from '../type/data-table-type';
import { getFilteredAdditionalFields } from '../utils';

type useTableStateObserverProps = {
  id: string;
  columns: TableObserverColumn[];
  state: TableState;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  columnSizing: Record<string, number>;
  columnVisibility: ColumnVisiblity;
};

type useTableStateFetchProps = {
  id: string;
  defaultColumnSettings: ColumnSettings[];
  setColumnOrder: (value: ColumnOrderState) => void;
  setColumnPinning: (value: ColumnPinningState) => void;
  setColumnSizing: (value: Record<string, number>) => void;
  setColumnVisibility: (value: ColumnVisiblity) => void;
  setAdditionalFields?: (value: string[]) => void;
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

/**
 * Get and sync table with user-preference
 */
export function useTableGetPreferenceEffect({
  id,
  defaultColumnSettings,
  setColumnOrder,
  setColumnPinning,
  setColumnSizing,
  setColumnVisibility,
  setAdditionalFields,
}: useTableStateFetchProps) {
  const tableUserPreference = useSWRImmutable(`get-${id}`, () => fetchUserPreference({ key: id }));

  useEffect(() => {
    if (tableUserPreference.isLoading) return;

    if (tableUserPreference.data) {
      const tablePreference = tableUserPreference.data.content as TableObserverProps;
      setColumnOrder(tablePreference.columnOrder);
      setColumnPinning(tablePreference.columnPinning);
      setColumnSizing(tablePreference.columnSizing);
      setColumnVisibility(tablePreference.columnVisibility);
      setAdditionalFields?.(
        getFilteredAdditionalFields({ columnVisibility: tablePreference.columnVisibility, defaultColumnSettings }),
      );
    }
  }, [tableUserPreference.isLoading]);
}

/**
 * Update user-preference of the table with a POST request
 */
export function useTableUpdatePreferenceEffect({
  id,
  state,
  columns,
  columnOrder,
  columnPinning,
  columnSizing,
  columnVisibility,
}: useTableStateObserverProps) {
  const { trigger } = useSWRMutation(`post-${id}`, postUserPreference);
  useEffect(() => {
    const handler = setTimeout(() => {
      trigger({
        key: id,
        userPreference: {
          content: {
            columnOrder,
            columnPinning,
            columnSizing,
            columnVisibility,
            columns,
            pagination: {
              pageSize: state.pagination?.pageSize,
            },
          },
          key: id,
        },
      });
    }, 350);

    return () => {
      if (handler) clearTimeout(handler);
    };
  }, [columnPinning, state.pagination, columnOrder, columnSizing, columnVisibility]);
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
