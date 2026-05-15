import { useCallback } from 'react';

import { QBActionType, useQBDispatch } from '../hooks/use-query-builder';
import { IValueFacet } from '../type';

import QueryPillContainer from './containers/query-pill-container';
import LabelOperator from './operators/label-operator';
import Operator from './operators/operator';
import QueryPillValues from './values/query-pill-values';

type SearchPillProps = {
  sqon: IValueFacet;
};

/**
 *          ┌────────────────────────┐
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >] [X]     | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 *          └────────────────────────┘
 */
function SearchQueryPill({ sqon }: SearchPillProps) {
  const dispatch = useQBDispatch();

  const onRemovePill = useCallback(() => {
    dispatch({
      type: QBActionType.REMOVE_FACET_PILL,
      payload: sqon,
    });
  }, [dispatch, sqon]);

  return (
    <QueryPillContainer onRemovePill={onRemovePill}>
      <div className="flex gap-2">
        <LabelOperator field={sqon.content.field} operator={<Operator size={14} type={sqon.op} />} />
        <QueryPillValues sqon={sqon} />
      </div>
    </QueryPillContainer>
  );
}
export default SearchQueryPill;
