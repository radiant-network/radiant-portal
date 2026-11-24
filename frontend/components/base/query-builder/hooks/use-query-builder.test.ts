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

describe('qBReducer REMOVE_FACET_PILL', () => {
  const q1 = query('q1', 'chromosome');
  const q2: ISyntheticSqon = { id: 'q2', op: BooleanOperators.And, content: [pill('variant_type'), pill('position')] };

  function contextWithQ1Active(sqons: ISyntheticSqon[]): IQBContext {
    return { ...getDefaultQBContext(), activeQueryId: 'q1', sqons } as IQBContext;
  }

  it('removes the pill from its own query, not from the active one', () => {
    const next = qBReducer(contextWithQ1Active([q1, q2]), {
      type: QBActionType.REMOVE_FACET_PILL,
      payload: pill('variant_type'),
      queryId: 'q2',
    });

    expect(next.sqons).toEqual([q1, { ...q2, content: [pill('position')] }]);
    expect(next.activeQueryId).toBe('q1');
  });

  it('deletes a non-active query emptied by the removal and keeps the active one', () => {
    const next = qBReducer(contextWithQ1Active([q1, query('q2', 'variant_type')]), {
      type: QBActionType.REMOVE_FACET_PILL,
      payload: pill('variant_type'),
      queryId: 'q2',
    });

    expect(next.sqons).toEqual([q1]);
    expect(next.activeQueryId).toBe('q1');
  });

  it('removes the pill from the active query when no queryId is given', () => {
    const next = qBReducer(contextWithQ1Active([{ ...q1, content: [pill('chromosome'), pill('position')] }, q2]), {
      type: QBActionType.REMOVE_FACET_PILL,
      payload: pill('chromosome'),
    });

    expect(next.sqons).toEqual([{ ...q1, content: [pill('position')] }, q2]);
    expect(next.activeQueryId).toBe('q1');
  });
});

describe('qBReducer REMOVE_QUERY with a combined query', () => {
  const q1 = query('q1', 'chromosome');
  const q2 = query('q2', 'variant_type');
  const q3: ISyntheticSqon = { id: 'q3', op: BooleanOperators.And, content: [q1, q2] };
  const q4: ISyntheticSqon = { id: 'q4', op: BooleanOperators.And, content: [] };

  function contextWithCombinedQuery(activeQueryId = 'q4'): IQBContext {
    const defaultContext = getDefaultQBContext();
    return {
      ...defaultContext,
      activeQueryId,
      sqons: [q1, q2, q3, q4],
      settings: { ...defaultContext.settings, combinedQueries: { q3: ['q1', 'q2'] } },
    } as IQBContext;
  }

  it('keeps the combined query while it still references a query', () => {
    const next = qBReducer(contextWithCombinedQuery(), { type: QBActionType.REMOVE_QUERY, payload: { id: 'q1' } });

    expect(next.sqons).toEqual([q2, { ...q3, content: [q2] }, q4]);
    expect(next.settings.combinedQueries).toEqual({ q3: ['q2'] });
  });

  it('removes the combined query left without any reference, keeping a single empty query', () => {
    const afterQ1 = qBReducer(contextWithCombinedQuery(), { type: QBActionType.REMOVE_QUERY, payload: { id: 'q1' } });
    const next = qBReducer(afterQ1, { type: QBActionType.REMOVE_QUERY, payload: { id: 'q2' } });

    expect(next.sqons).toEqual([q4]);
    expect(next.settings.combinedQueries).toEqual({});
    expect(next.activeQueryId).toBe('q4');
  });

  it('activates the next query when the active combined query is removed', () => {
    const afterQ1 = qBReducer(contextWithCombinedQuery('q3'), {
      type: QBActionType.REMOVE_QUERY,
      payload: { id: 'q1' },
    });
    const next = qBReducer(afterQ1, { type: QBActionType.REMOVE_QUERY, payload: { id: 'q2' } });

    expect(next.activeQueryId).toBe('q4');
  });
});
