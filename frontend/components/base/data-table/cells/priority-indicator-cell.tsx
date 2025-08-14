import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import PriorityIndicator, { PriorityIndicatorCode } from '../../indicators/priority-indicator';

type PriorityIndicatorCellProps = {
  code: PriorityIndicatorCode | undefined;
};

function PriorityIndicatorCell({ code }: PriorityIndicatorCellProps) {
  const { t } = useI18n();

  if (!code) return <EmptyCell />;

  return (
    <Tooltip>
      <TooltipTrigger>
        <PriorityIndicator code={code} />
      </TooltipTrigger>
      <TooltipContent>{t(`case_exploration.priority.${code}_tooltip`)}</TooltipContent>
    </Tooltip>
  );
}

export default PriorityIndicatorCell;
