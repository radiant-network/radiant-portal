import { format, formatDistance, isThisYear, isToday, parseISO } from 'date-fns';
import { enCA } from 'date-fns/locale/en-CA';
import { frCA } from 'date-fns/locale/fr-CA';
import type { TFunction } from 'i18next';

const DATE_PART_LENGTH = 10;

// The API serves a calendar date as a UTC midnight instant, which a timezone west of Greenwich
// drags back a day — so a date is formatted from its date part alone. asDate forces that reading.
export function formatDate(value: string, pattern: string, asDate: boolean = false) {
  const isDate = asDate || !value.includes('T');

  return format(parseISO(isDate ? value.slice(0, DATE_PART_LENGTH) : value), pattern);
}

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
