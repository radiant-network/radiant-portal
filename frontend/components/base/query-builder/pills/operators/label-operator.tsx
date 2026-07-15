import { ReactNode } from 'react';

import { useI18n } from '@/components/hooks/i18n';

import { useQBAggregations, useQBSettings } from '../../hooks/use-query-builder';
import { findAggregationByField } from '../../libs/aggregations';

type LabelOperatorQueryPillProps = {
  field: string;
  operator: ReactNode;
};

/**
 * Label for a pill
 * @TODO: Change dictionary key from filters to facet
 *
 * The label must match the facet title, so it is resolved from the aggregation's
 * `translation_key` (like the facet does), not the raw sqon field key.
 *
 *          ┌────────────┐                   ┌─────┐
 * ┌───────┌───────────────────────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >][X] and Ipsum < 60[x]     | 389K | [copy] [trash]  |
 * └───────└───────────────────────────────────────────────────────────┘─────────────────┘
 *          └────────────┘                   └─────┘
 */
function LabelOperator({ field, operator }: LabelOperatorQueryPillProps) {
  const { t, lazyTranslate } = useI18n();
  const { labelsEnabled } = useQBSettings();
  const aggregations = useQBAggregations();

  if (!labelsEnabled) return null;

  const aggregation = findAggregationByField(aggregations, field);
  const translationKey = aggregation?.translation_key ?? field;

  return (
    <div className="flex items-center">
      <span className="ml-1 mr-0.5 text-xs font-medium">
        {t(`common.filters.labels.${translationKey}`, { defaultValue: lazyTranslate(field) })}
      </span>
      <span className="ml-1 mr-0.5">{operator}</span>
    </div>
  );
}
export default LabelOperator;
