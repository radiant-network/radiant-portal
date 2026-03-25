import { format, isThisYear, isToday } from 'date-fns';
import { TFunction } from 'i18next';

export function formatRelativeByCurrentTime(t: TFunction<string, undefined>, datetime: string) {
  const date = new Date(datetime);

  if (isToday(date)) {
    return format(date, t('common.date.hour'));
  }

  if (isThisYear(date)) {
    return format(date, t('common.date.month_day_hour'));
  }

  return format(date, t('common.date.year_month_day_hour'));
}
