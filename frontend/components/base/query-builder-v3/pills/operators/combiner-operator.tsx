import { MouseEvent, useCallback } from 'react';

import {
  QBActionType,
  useQBActiveQuery,
  useQBDispatch,
} from '@/components/base/query-builder-v3/hooks/use-query-builder';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { BooleanOperators } from '../../type';

/**
 * Combiner is "and" or "or" operator that link every pill
 *
 *                                       ┌───┐
 * ┌───────┌───────────────────────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >][X] and Ipsum < 60[x]     | 389K | [copy] [trash]  |
 * └───────└───────────────────────────────────────────────────────────┘─────────────────┘
 *                                       └───┘
 */
function CombinerOperator() {
  const { t } = useI18n();
  const activeQuery = useQBActiveQuery();
  const dispatch = useQBDispatch();

  const handleOnClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: QBActionType.CHANGE_COMBINER_OPERATOR,
      payload: {
        operator: activeQuery.op === BooleanOperators.And ? BooleanOperators.Or : BooleanOperators.And,
      },
    });
  }, []);

  return (
    <div className="px-2" onClick={handleOnClick}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="link"
            className="text-current text-sm p-0 h-auto font-normal"
            onClick={() => {
              console.warn('CombinerOperator:onClick is not implemented');
            }}
          >
            {t(`common.query_pill.operator.${activeQuery.op}`)}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t('common.query_pill.operator.change_operator_to')}
          {activeQuery.op === BooleanOperators.And
            ? t(`common.query_pill.operator.or`)
            : t(`common.query_pill.operator.and`)}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
export default CombinerOperator;
