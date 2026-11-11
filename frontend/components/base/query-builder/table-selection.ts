import type { RowSelectionState } from '@tanstack/react-table';

import type { Sqon, SqonContent } from '@/api/api';

import type { ISyntheticSqon } from './type';

export type TableSelectionMode = 'picked' | 'all';

/**
 * `picked`: `ids` holds the checked rows.
 * `all`: every result is selected except `ids`, the rows unchecked after "Select all".
 */
export type TableSelectionState = {
  mode: TableSelectionMode;
  ids: ReadonlySet<string>;
};

export const EMPTY_TABLE_SELECTION: TableSelectionState = { mode: 'picked', ids: new Set() };

export const SELECT_ALL_TABLE_SELECTION: TableSelectionState = { mode: 'all', ids: new Set() };

export function isRowSelected(state: TableSelectionState, id: string): boolean {
  return state.mode === 'all' ? !state.ids.has(id) : state.ids.has(id);
}

export function isPageFullySelected(state: TableSelectionState, pageIds: string[]): boolean {
  return pageIds.length > 0 && pageIds.every(id => isRowSelected(state, id));
}

export function toPageRowSelection(state: TableSelectionState, pageIds: string[]): RowSelectionState {
  return Object.fromEntries(pageIds.filter(id => isRowSelected(state, id)).map(id => [id, true]));
}

export function applyPageSelectionChange(
  state: TableSelectionState,
  pageIds: string[],
  nextPageSelection: RowSelectionState,
): TableSelectionState {
  const ids = new Set(state.ids);
  pageIds.forEach(id => {
    const selected = !!nextPageSelection[id];
    const tracked = state.mode === 'all' ? !selected : selected;
    if (tracked) {
      ids.add(id);
    } else {
      ids.delete(id);
    }
  });
  return { mode: state.mode, ids };
}

export function getSelectedCount(state: TableSelectionState, total: number): number {
  return state.mode === 'all' ? Math.max(total - state.ids.size, 0) : state.ids.size;
}

export function buildSelectionSqon(
  activeQuery: Pick<ISyntheticSqon, 'op' | 'content'>,
  field: string,
  ids: string[],
  op: 'in' | 'not-in',
): Sqon {
  const idsFilter: Sqon = { op, content: { field, value: ids } };
  const content =
    activeQuery.content.length > 0
      ? [{ op: activeQuery.op as Sqon['op'], content: activeQuery.content as SqonContent }, idsFilter]
      : [idsFilter];

  return { op: 'and', content };
}
