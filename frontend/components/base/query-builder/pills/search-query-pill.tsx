import { useCallback } from 'react';

import { FilterTypes } from '@/components/cores/applications-config';

import { QBActionType, useQBAggregations, useQBDispatch } from '../hooks/use-query-builder';
import { findAggregationByField } from '../libs/aggregations';
import type { IValueFacet } from '../type';

import QueryPillContainer from './containers/query-pill-container';
import LabelOperator from './operators/label-operator';
import Operator from './operators/operator';
import QueryPillValues from './values/query-pill-values';

type SearchPillProps = {
  queryId: string;
  sqon: IValueFacet;
};

/**
 *          ┌────────────────────────┐
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >] [X]     | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 *          └────────────────────────┘
 */
function SearchQueryPill({ queryId, sqon }: SearchPillProps) {
  const dispatch = useQBDispatch();
  const aggregations = useQBAggregations();
  const isVariantSearch =
    findAggregationByField(aggregations, `${FilterTypes.SEARCH_BY}_${sqon.content.field}`)?.type ===
    FilterTypes.SEARCH_BY_VARIANT;

  const onRemovePill = useCallback(() => {
    dispatch({
      type: QBActionType.REMOVE_FACET_PILL,
      payload: sqon,
      queryId,
    });
  }, [dispatch, queryId, sqon]);

  return (
    <QueryPillContainer onRemovePill={onRemovePill}>
      <div className="flex gap-2">
        <LabelOperator field={sqon.content.field} operator={<Operator size={14} type={sqon.op} />} />
        <QueryPillValues sqon={sqon} preserveCase={isVariantSearch} />
      </div>
    </QueryPillContainer>
  );
}
export default SearchQueryPill;
