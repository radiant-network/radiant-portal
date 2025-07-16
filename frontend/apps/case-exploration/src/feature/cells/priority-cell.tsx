import { Indicator, IndicatorProps } from '@/components/base/ui/indicator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import EmptyField from '@/components/base/information/empty-field';
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

  if (!code) return <EmptyField />;

  const color = colors[code];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Indicator variant={color}>
          <span>{t(`caseExploration.priority.${code}`)}</span>
        </Indicator>
      </TooltipTrigger>
      <TooltipContent>{t(`caseExploration.priority.${code}_tooltips`)}</TooltipContent>
    </Tooltip>
  );
}

export default PriorityCell;
