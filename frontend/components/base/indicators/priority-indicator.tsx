import { Indicator, IndicatorProps } from '@/components/base/ui/indicator';
import { useI18n } from '@/components/hooks/i18n';

export type PriorityIndicatorCode = 'asap' | 'routine' | 'stat' | 'urgent';

type PriorityIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  code: PriorityIndicatorCode;
};

const colors: Record<string, IndicatorProps['variant']> = {
  asap: 'amber',
  routine: 'grey',
  stat: 'red',
  urgent: 'blue',
};

function PriorityIndicator({ code, ...props }: PriorityIndicatorProps) {
  const { t } = useI18n();

  const color = colors[code];

  return (
    <Indicator variant={color} {...props}>
      <span>{t(`case_exploration.priority.${code}`)}</span>
    </Indicator>
  );
}

export default PriorityIndicator;
