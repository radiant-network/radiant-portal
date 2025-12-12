import { Indicator, IndicatorProps } from '@/components/base/shadcn/indicator';
import { useI18n } from '@/components/hooks/i18n';

export type PriorityIndicatorCode = 'asap' | 'routine' | 'stat' | 'urgent';

type PriorityIndicatorProps = Omit<IndicatorProps, 'variant'> & {
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
    <Indicator {...props} variant={color}>
      <span>{t(`case_exploration.priority.${code}`)}</span>
    </Indicator>
  );
}

export default PriorityIndicator;
