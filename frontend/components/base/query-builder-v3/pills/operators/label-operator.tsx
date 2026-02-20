import { ReactNode } from 'react';

import { useI18n } from '@/components/hooks/i18n';

type LabelOperatorQueryPillProps = {
  field: string;
  operator: ReactNode;
};

/**
 * Label for a pill
 * @TODO: Change dictionary key from filters to facet
 *
 *          ┌────────────┐                   ┌─────┐
 * ┌───────┌───────────────────────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >][X] and Ipsum < 60[x]     | 389K | [copy] [trash]  |
 * └───────└───────────────────────────────────────────────────────────┘─────────────────┘
 *          └────────────┘                   └─────┘
 */
function LabelOperator({ field, operator }: LabelOperatorQueryPillProps) {
  const { t, lazyTranslate } = useI18n();
  return (
    <div className="flex items-center">
      <span className="ml-1 mr-0.5 text-xs font-medium">
        {t(`common.filters.labels.${field}`, { defaultValue: lazyTranslate(field) })}
      </span>
      <span className="ml-1 mr-0.5">{operator}</span>
    </div>
  );
}
export default LabelOperator;
