import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

export type TimeMarkerType = 'event' | 'treatment';

type TimeMarkerProps = {
  type: TimeMarkerType;
  startDay?: number;
  endDay?: number;
  years?: number;
  className?: string;
};

const typeStyles: Record<TimeMarkerType, { day: string; years: string; container: string }> = {
  event: {
    day: 'text-sm font-semibold',
    years: 'text-sm font-normal',
    container: '',
  },
  treatment: {
    day: 'text-xs font-medium',
    years: 'text-xs font-normal',
    container: 'h-5',
  },
};

function TimeMarker({ type, startDay, endDay, years, className }: TimeMarkerProps) {
  const { t } = useI18n();
  const styles = typeStyles[type];
  let dayLabel: string;
  if (startDay === undefined) {
    dayLabel = t('timeline.marker.day_unknown');
  } else if (endDay !== undefined) {
    dayLabel = t('timeline.marker.day_range', { start: startDay, end: endDay });
  } else {
    dayLabel = t('timeline.marker.day', { day: startDay });
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-end gap-2 font-mono text-foreground',
        styles.container,
        className,
      )}
    >
      <span className={styles.day}>{dayLabel}</span>
      {years !== undefined && (
        <span className={cn('border-l border-border pl-2 text-muted-foreground', styles.years)}>
          {t('timeline.marker.years', { value: years.toFixed(1) })}
        </span>
      )}
    </div>
  );
}

export default TimeMarker;
