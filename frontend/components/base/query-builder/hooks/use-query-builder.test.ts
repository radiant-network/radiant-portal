import { describe, expect, it } from 'vitest';

import { BooleanOperators, type ISyntheticSqon, type IValueFacet } from '../type';

import { getDefaultQBContext, type IQBContext, QBActionType, qBReducer } from './use-query-builder';

function pill(field: string): IValueFacet {
  return { content: { field, value: ['1'] }, op: 'in' };
}

function query(id: string, field: string): ISyntheticSqon {
  return { id, op: BooleanOperators.And, content: [pill(field)] };
}

function contextWithTwoSelectedQueries(activeQueryId = 'q1'): IQBContext {
  return {
    ...getDefaultQBContext(),
    activeQueryId,
    sqons: [query('q1', 'chromosome'), query('q2', 'variant_type')],
    cache: { selectedQueries: ['q1', 'q2'] },
  } as IQBContext;
}

describe('qBReducer selectedQueries', () => {
  it('clears the selection when a query is deleted and only one remains', () => {
    const next = qBReducer(contextWithTwoSelectedQueries(), { type: QBActionType.REMOVE_QUERY, payload: { id: 'q2' } });

    expect(next.cache.selectedQueries).toEqual([]);
  });

  it('clears the selection when a query loses its last pill and only one remains', () => {
    const next = qBReducer(contextWithTwoSelectedQueries('q2'), {
      type: QBActionType.REMOVE_FACET_PILL,
      payload: pill('variant_type'),
    });

    expect(next.sqons.map(sqon => sqon.id)).toEqual(['q1']);
    expect(next.cache.selectedQueries).toEqual([]);
  });

  it('does not restore a selection after a new query brings the checkboxes back', () => {
    const afterRemove = qBReducer(contextWithTwoSelectedQueries(), {
      type: QBActionType.REMOVE_QUERY,
      payload: { id: 'q2' },
    });
    const next = qBReducer(
      { ...afterRemove, sqons: [...afterRemove.sqons, query('q3', 'variant_type')], activeQueryId: 'q3' },
      { type: QBActionType.SET_ACTIVE_QUERY, payload: { id: 'q3' } },
    );

    expect(afterRemove.cache.selectedQueries).toEqual([]);
    expect(next.cache.selectedQueries).toEqual([]);
  });

  it('keeps the other selected queries when at least 2 queries remain', () => {
    const context = {
      ...contextWithTwoSelectedQueries(),
      sqons: [query('q1', 'chromosome'), query('q2', 'variant_type'), query('q3', 'position')],
      cache: { selectedQueries: ['q1', 'q2', 'q3'] },
    };
    const next = qBReducer(context, { type: QBActionType.REMOVE_QUERY, payload: { id: 'q2' } });

    expect(next.cache.selectedQueries).toEqual(['q1', 'q3']);
  });

  it('clears the selection when all queries are removed', () => {
    const next = qBReducer(contextWithTwoSelectedQueries(), { type: QBActionType.REMOVE_ALL_QUERIES });

    expect(next.cache.selectedQueries).toEqual([]);
  });

  it('clears the selection when queries are loaded', () => {
    const next = qBReducer(contextWithTwoSelectedQueries(), {
      type: QBActionType.LOAD_QUERIES,
      payload: [query('q3', 'chromosome')],
    });

    expect(next.cache.selectedQueries).toEqual([]);
  });
});
