import { useCallback } from 'react';

import { FacetComponent } from '@/components/base/query-builder-v3/facets/facet-container';
import { QBActionType, useQBContext, useQBDispatch } from '@/components/base/query-builder-v3/hooks/use-query-builder';
import { getAggregationByField } from '@/components/base/query-builder-v3/libs/aggregations';
import QueryPillContainer from '@/components/base/query-builder-v3/pills/containers/query-pill-container';
import LabelOperator from '@/components/base/query-builder-v3/pills/operators/label-operator';
import Operator from '@/components/base/query-builder-v3/pills/operators/operator';
import QueryPillValues from '@/components/base/query-builder-v3/pills/values/query-pill-values';
import { IValueFacet } from '@/components/base/query-builder-v3/type';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';

type MultiSelectPillProps = {
  sqon: IValueFacet;
};

/**
 *          ┌────────────────────────┐
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >] [X]     | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 *          └────────────────────────┘
 */
function MultiSelectQueryPill({ sqon }: MultiSelectPillProps) {
  const { aggregations } = useQBContext();
  const aggregation = getAggregationByField(aggregations, sqon.content.field);
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
        <Popover>
          <PopoverTrigger>
            <QueryPillValues sqon={sqon} />
          </PopoverTrigger>
          <PopoverContent align="start" className="p-2.5">
            <FacetComponent field={aggregation} isOpen />
          </PopoverContent>
        </Popover>
      </div>
    </QueryPillContainer>
  );
}
export default MultiSelectQueryPill;
