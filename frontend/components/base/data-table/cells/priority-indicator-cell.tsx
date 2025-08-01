import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
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
      <TooltipContent>{t(`caseExploration.priority.${code}_tooltips`)}</TooltipContent>
    </Tooltip>
  );
}

export default PriorityIndicatorCell;
