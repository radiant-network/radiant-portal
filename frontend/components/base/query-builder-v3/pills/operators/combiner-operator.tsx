import { MouseEvent, useCallback } from 'react';

import { QBActionType, useQBDispatch } from '@/components/base/query-builder-v3/hooks/use-query-builder';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { BooleanOperators, ISyntheticSqon } from '../../type';

type CombineOperatorProps = {
  sqon: ISyntheticSqon;
};

/**
 * Combiner is "and" or "or" operator that link every pill
 *
 *                                       ┌───┐
 * ┌───────┌───────────────────────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >][X] and Ipsum < 60[x]     | 389K | [copy] [trash]  |
 * └───────└───────────────────────────────────────────────────────────┘─────────────────┘
 *                                       └───┘
 */
function CombinerOperator({ sqon }: CombineOperatorProps) {
  const { t } = useI18n();
  const dispatch = useQBDispatch();

  const handleOnClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: QBActionType.CHANGE_COMBINER_OPERATOR,
      payload: {
        operator: sqon.op === BooleanOperators.And ? BooleanOperators.Or : BooleanOperators.And,
      },
    });
  }, []);

  return (
    <div className="px-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="link" className="text-current text-sm p-0 h-auto font-normal" onClick={handleOnClick}>
            {t(`common.query_pill.operator.${sqon.op}`)}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t('common.query_pill.operator.change_operator_to')}
          {sqon.op === BooleanOperators.And ? t(`common.query_pill.operator.or`) : t(`common.query_pill.operator.and`)}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
export default CombinerOperator;
