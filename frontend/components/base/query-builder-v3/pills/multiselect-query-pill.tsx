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
  content: IValueFacet;
};

/**
 *          ┌────────────────────────┐
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >] [X]     | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 *          └────────────────────────┘
 */
function MultiSelectQueryPill({ content }: MultiSelectPillProps) {
  const { aggregations } = useQBContext();
  const aggregation = getAggregationByField(aggregations, content.content.field);
  const dispatch = useQBDispatch();

  const onRemovePill = useCallback(() => {
    dispatch({
      type: QBActionType.REMOVE_FACET_PILL,
      payload: content,
    });
  }, [content]);

  return (
    <QueryPillContainer onRemovePill={onRemovePill}>
      <div className="flex gap-2">
        <LabelOperator field={content.content.field} operator={<Operator size={14} type={content.op} />} />
        <Popover>
          <PopoverTrigger>
            <QueryPillValues valueFacet={content} />
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
