import { format, formatDistance, isThisYear, isToday } from 'date-fns';
import { enCA } from 'date-fns/locale/en-CA';
import { frCA } from 'date-fns/locale/fr-CA';
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

export function formatDistanceDate(datetime: string, currentLanguage: string) {
  return formatDistance(new Date(), new Date(datetime), {
    locale: currentLanguage === 'fr' ? frCA : enCA,
  });
}
