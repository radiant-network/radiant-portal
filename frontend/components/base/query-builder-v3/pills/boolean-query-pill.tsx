import { useCallback } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '../../shadcn/popover';
import { FacetComponent } from '../facets/facet-container';
import { QBActionType, useQBContext, useQBDispatch } from '../hooks/use-query-builder';
import { getAggregationByField } from '../libs/aggregations';
import { IValueFacet } from '../type';

import QueryPillContainer from './containers/query-pill-container';
import LabelOperator from './operators/label-operator';
import Operator from './operators/operator';
import QueryPillValues from './values/query-pill-values';

type BooleanPillProps = {
  content: IValueFacet;
};

/**
 *          ┌───────────────────┐
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = true [X]     | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 *          └───────────────────┘
 */
function BooleanQueryPill({ content }: BooleanPillProps) {
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
export default BooleanQueryPill;
