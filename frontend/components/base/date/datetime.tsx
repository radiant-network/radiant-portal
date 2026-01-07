import { formatDate } from 'date-fns';

import { useI18n } from '@/components/hooks/i18n';

type DateTimeProps = {
  date: string;
};

/**
 * i18n will cause formatting issue when using formatDate
 * e.g. formatDate(date, t('common.datetime')) where datetime is "yyyy-MM-dd 'at' hh:mm a"
 *      will not works because of how i18n format the string.
 *
 * Solution, format and re-add to a new translation string
 */
function DateTime({ date }: DateTimeProps) {
  const { t } = useI18n();
  const formattedDate = formatDate(date, t('common.date'));
  const formattedTime = formatDate(date, t('common.time'));

  return (
    <span>
      {t('common.datetime', {
        date: formattedDate,
        time: formattedTime,
      })}
    </span>
  );
}
export default DateTime;
