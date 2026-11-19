import { useCallback } from 'react';

import { useI18n } from '@/components/hooks/i18n';

import { Popover, PopoverContent, PopoverTrigger } from '../../shadcn/popover';
import { FacetComponent } from '../facets/facet-container';
import { QBActionType, useQBAggregations, useQBContext, useQBDispatch } from '../hooks/use-query-builder';
import { findAggregationByField, getAggregationByField } from '../libs/aggregations';
import type { IValueFacet } from '../type';

import QueryPillContainer from './containers/query-pill-container';
import Operator from './operators/operator';
import QueryPillValues from './values/query-pill-values';

type NumericalPillProps = {
  queryId: string;
  sqon: IValueFacet;
};

/**
 *          ┌───────────────────┐
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum < 100  [X]     | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 *          └───────────────────┘
 */
function NumericalQueryPill({ queryId, sqon }: NumericalPillProps) {
  const { t, lazyTranslate } = useI18n();
  const { aggregations } = useQBContext();
  const aggregation = getAggregationByField(aggregations, sqon.content.field);
  const dispatch = useQBDispatch();
  const qbAggregations = useQBAggregations();
  const labelAggregation = findAggregationByField(qbAggregations, sqon.content.field);
  const translationKey = labelAggregation?.translation_key ?? sqon.content.field;

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
        <div className="flex items-center">
          <span className="ml-1 mr-0.5 text-xs font-medium">
            {t(`common.facets.labels.${translationKey}`, { defaultValue: lazyTranslate(sqon.content.field) })}
          </span>
          <span className="ml-1 mr-0.5">
            <Operator size={14} type={sqon.op} />
          </span>
        </div>
        <Popover>
          <PopoverTrigger data-cy="query-pill-value">
            <QueryPillValues sqon={sqon} clickable />
          </PopoverTrigger>
          <PopoverContent align="start" className="p-2.5" data-cy="query-pill-editor">
            <FacetComponent field={aggregation} isOpen />
          </PopoverContent>
        </Popover>
      </div>
    </QueryPillContainer>
  );
}
export default NumericalQueryPill;
