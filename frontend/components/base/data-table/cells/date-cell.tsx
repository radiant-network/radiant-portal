import { formatDate } from 'date-fns';

import { useI18n } from '@/components/hooks/i18n';

import EmptyCell from './empty-cell';

type DateCellProps = {
  date?: string;
};

function DateCell({ date }: DateCellProps) {
  const { t } = useI18n();

  if (!date) return <EmptyCell />;

  return <div className="font-mono text-xs font-medium">{formatDate(date, t('common.date'))}</div>;
}

export default DateCell;
