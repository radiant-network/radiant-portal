import { useQBActiveQuery } from '@/components/base/query-builder-v3/hooks/use-query-builder';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { BooleanOperators } from '../../type';

function CombinerOperator() {
  const { t } = useI18n();
  const activeQuery = useQBActiveQuery();
  return (
    <div className="px-2" onClick={e => e.stopPropagation()}>
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
