import { formatDate } from 'date-fns';

import { useI18n } from '@/components/hooks/i18n';
import { formatDate as formatCalendarDate } from '@/components/lib/date';

import EmptyCell from './empty-cell';

type DateCellProps = {
  date?: string;
  asDate?: boolean;
};

// asDate shows a calendar date (e.g. ClinVar date_last_evaluated) on its own day in every timezone;
// leave it off for real timestamps (created_on, updated_on), which stay in local time.
function DateCell({ date, asDate = false }: DateCellProps) {
  const { t } = useI18n();

  if (!date) return <EmptyCell />;

  const pattern = t('common.date.year_month_day');
  const formatted = asDate ? formatCalendarDate(date, pattern, true) : formatDate(date, pattern);

  return <div className="font-mono text-xs font-medium">{formatted}</div>;
}

export default DateCell;
