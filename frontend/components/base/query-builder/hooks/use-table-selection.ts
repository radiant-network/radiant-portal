import { useEffect, useMemo, useRef, useState } from 'react';
import type { OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import chunk from 'lodash/chunk';

import type { Sqon, SqonContent } from '@/api/api';

import {
  applyPageSelectionChange,
  buildSelectionSqon,
  EMPTY_TABLE_SELECTION,
  getSelectedCount,
  isPageFullySelected,
  SELECT_ALL_TABLE_SELECTION,
  type TableSelectionMode,
  type TableSelectionState,
  toPageRowSelection,
} from '../table-selection';
import type { ISyntheticSqon } from '../type';

import type { IListInput } from './use-query-builder';

const MAX_LIST_LIMIT = 200;

type UseTableSelectionParams = {
  idField: string;
  pageRows: any[];
  total: number;
  activeQuery: ISyntheticSqon;
  extraBodyParams: Record<string, any>;
  resetKey: string | number;
  fetchList: (input: IListInput) => Promise<any[]>;
};

export type TableSelection = {
  mode: TableSelectionMode;
  selectedCount: number;
  canSelectAll: boolean;
  selectAll: () => void;
  clear: () => void;
  getSelectedIds: (limit: number) => Promise<string[]>;
};

function useTableSelection({
  idField,
  pageRows,
  total,
  activeQuery,
  extraBodyParams,
  resetKey,
  fetchList,
}: UseTableSelectionParams) {
  const [state, setState] = useState<TableSelectionState>(EMPTY_TABLE_SELECTION);
  const stateRef = useRef(state);
  stateRef.current = state;
  const isFirstFilterRun = useRef(true);
  const isFirstResetRun = useRef(true);

  const getRowId = (row: any) => String(row[idField]);
  const pageIds = useMemo(() => pageRows.map(getRowId), [pageRows, idField]);
  const rowSelection = useMemo(() => toPageRowSelection(state, pageIds), [state, pageIds]);
  const selectedCount = getSelectedCount(state, total);
  const canSelectAll = state.mode === 'picked' && isPageFullySelected(state, pageIds) && total > pageIds.length;

  const listIds = async (sqon: Sqon, limit: number) => {
    const rows = await fetchList({
      listBody: { additional_fields: [], limit, page_index: 0, sort: [], sqon, ...extraBodyParams },
    });
    return rows.map(getRowId);
  };

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = updater => {
    const next = typeof updater === 'function' ? updater(rowSelection) : updater;
    setState(prev => applyPageSelectionChange(prev, pageIds, next));
  };

  const getSelectedIds = async (limit: number) => {
    if (state.mode === 'picked') return [...state.ids];

    const excludedIds = [...state.ids];
    const sqon =
      excludedIds.length > 0
        ? buildSelectionSqon(activeQuery, idField, excludedIds, 'not-in')
        : { op: activeQuery.op as Sqon['op'], content: activeQuery.content as SqonContent };
    return listIds(sqon, limit);
  };

  // Drop the tracked ids that left the results; ids picked meanwhile are kept.
  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
      return;
    }

    const trackedIds = [...stateRef.current.ids];
    if (trackedIds.length === 0) return;

    let cancelled = false;
    Promise.all(
      chunk(trackedIds, MAX_LIST_LIMIT).map(batch =>
        listIds(buildSelectionSqon(activeQuery, idField, batch, 'in'), batch.length),
      ),
    )
      .then(results => {
        if (cancelled) return;
        const keptIds = new Set(results.flat());
        const removedIds = new Set(trackedIds.filter(id => !keptIds.has(id)));
        if (removedIds.size === 0) return;
        setState(prev => ({ mode: prev.mode, ids: new Set([...prev.ids].filter(id => !removedIds.has(id))) }));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [activeQuery, extraBodyParams]);

  useEffect(() => {
    if (isFirstResetRun.current) {
      isFirstResetRun.current = false;
      return;
    }
    setState(EMPTY_TABLE_SELECTION);
  }, [resetKey]);

  const selection: TableSelection = {
    mode: state.mode,
    selectedCount,
    canSelectAll,
    selectAll: () => setState(SELECT_ALL_TABLE_SELECTION),
    clear: () => setState(EMPTY_TABLE_SELECTION),
    getSelectedIds,
  };

  return { getRowId, rowSelection, onRowSelectionChange, selection };
}

export default useTableSelection;
