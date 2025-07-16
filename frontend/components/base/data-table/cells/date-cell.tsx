import { useI18n } from '@/components/hooks/i18n';
import { formatDate } from 'date-fns';

type DateCellProps = {
  date: string;
};

function DateCell({ date }: DateCellProps) {
  const { t } = useI18n();
  return <div className="font-mono text-xs font-medium">{formatDate(date, t('common.date'))}</div>;
}

export default DateCell;
