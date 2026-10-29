import { describe, expect, it } from 'vitest';

import {
  applyPageSelectionChange,
  buildSelectionSqon,
  EMPTY_TABLE_SELECTION,
  getSelectedCount,
  isPageFullySelected,
  isRowSelected,
  SELECT_ALL_TABLE_SELECTION,
  type TableSelectionState,
  toPageRowSelection,
} from './table-selection';

const PAGE_IDS = ['a', 'b', 'c'];

function picked(...ids: string[]): TableSelectionState {
  return { mode: 'picked', ids: new Set(ids) };
}

function allExcept(...ids: string[]): TableSelectionState {
  return { mode: 'all', ids: new Set(ids) };
}

describe('isRowSelected', () => {
  it('selects only the picked rows in picked mode', () => {
    expect(isRowSelected(picked('a'), 'a')).toBe(true);
    expect(isRowSelected(picked('a'), 'b')).toBe(false);
  });

  it('selects every row except the excluded ones in all mode', () => {
    expect(isRowSelected(allExcept('a'), 'a')).toBe(false);
    expect(isRowSelected(allExcept('a'), 'b')).toBe(true);
  });
});

describe('isPageFullySelected', () => {
  it('is true when every row of the page is selected', () => {
    expect(isPageFullySelected(picked('a', 'b', 'c'), PAGE_IDS)).toBe(true);
  });

  it('is false when one row of the page is not selected', () => {
    expect(isPageFullySelected(picked('a', 'b'), PAGE_IDS)).toBe(false);
  });

  it('is false on an empty page', () => {
    expect(isPageFullySelected(SELECT_ALL_TABLE_SELECTION, [])).toBe(false);
  });
});

describe('toPageRowSelection', () => {
  it('keeps only the page rows in picked mode', () => {
    expect(toPageRowSelection(picked('a', 'z'), PAGE_IDS)).toEqual({ a: true });
  });

  it('checks every page row except the excluded ones in all mode', () => {
    expect(toPageRowSelection(allExcept('b'), PAGE_IDS)).toEqual({ a: true, c: true });
  });
});

describe('applyPageSelectionChange', () => {
  it('adds a checked row in picked mode', () => {
    const next = applyPageSelectionChange(EMPTY_TABLE_SELECTION, PAGE_IDS, { a: true });
    expect(next).toEqual(picked('a'));
  });

  it('keeps the rows picked on other pages', () => {
    const next = applyPageSelectionChange(picked('z'), PAGE_IDS, { a: true });
    expect(next).toEqual(picked('z', 'a'));
  });

  it('removes an unchecked row in picked mode', () => {
    const next = applyPageSelectionChange(picked('a', 'b'), PAGE_IDS, { b: true });
    expect(next).toEqual(picked('b'));
  });

  it('excludes an unchecked row in all mode', () => {
    const next = applyPageSelectionChange(SELECT_ALL_TABLE_SELECTION, PAGE_IDS, { a: true, c: true });
    expect(next).toEqual(allExcept('b'));
  });

  it('includes back a re-checked row in all mode', () => {
    const next = applyPageSelectionChange(allExcept('b'), PAGE_IDS, { a: true, b: true, c: true });
    expect(next).toEqual(SELECT_ALL_TABLE_SELECTION);
  });
});

describe('getSelectedCount', () => {
  it('counts the picked rows in picked mode', () => {
    expect(getSelectedCount(picked('a', 'b'), 500)).toBe(2);
  });

  it('subtracts the excluded rows from the total in all mode', () => {
    expect(getSelectedCount(allExcept('a', 'b'), 500)).toBe(498);
  });

  it('never goes below zero in all mode', () => {
    expect(getSelectedCount(allExcept('a', 'b'), 1)).toBe(0);
  });
});

describe('buildSelectionSqon', () => {
  it('ands the active query with the ids filter', () => {
    const activeQuery = { op: 'and', content: [{ content: { field: 'chromosome', value: ['1'] }, op: 'in' }] } as any;

    expect(buildSelectionSqon(activeQuery, 'locus_id', ['a', 'b'], 'in')).toEqual({
      op: 'and',
      content: [
        { op: 'and', content: [{ content: { field: 'chromosome', value: ['1'] }, op: 'in' }] },
        { op: 'in', content: { field: 'locus_id', value: ['a', 'b'] } },
      ],
    });
  });

  it('keeps only the ids filter when the active query is empty', () => {
    const activeQuery = { op: 'and', content: [] } as any;

    expect(buildSelectionSqon(activeQuery, 'locus_id', ['a'], 'not-in')).toEqual({
      op: 'and',
      content: [{ op: 'not-in', content: { field: 'locus_id', value: ['a'] } }],
    });
  });
});
