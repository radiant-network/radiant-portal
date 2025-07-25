import { Indicator, IndicatorProps } from '@/components/base/ui/indicator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { useI18n } from '@/components/hooks/i18n';

type PriorityCellProps = {
  code: 'asap' | 'routine' | 'stat' | 'urgent' | undefined;
};

const colors: Record<string, IndicatorProps['variant']> = {
  asap: 'amber',
  routine: 'grey',
  stat: 'red',
  urgent: 'blue',
};

function PriorityCell({ code }: PriorityCellProps) {
  const { t } = useI18n();

  if (!code) return <EmptyCell />;

  const color = colors[code];

  return (
    <Tooltip>
      <TooltipTrigger>
        <Indicator variant={color}>
          <span>{t(`caseExploration.priority.${code}`)}</span>
        </Indicator>
      </TooltipTrigger>
      <TooltipContent>{t(`caseExploration.priority.${code}_tooltips`)}</TooltipContent>
    </Tooltip>
  );
}

export default PriorityCell;
