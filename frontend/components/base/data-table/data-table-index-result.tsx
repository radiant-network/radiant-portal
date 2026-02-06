import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

/**
 * TableIndexResult
 * show current page and total page
 */
type TableIndexResultProp = {
  total: number;
  loading?: boolean;
  pageIndex: number;
  pageSize: number;
};

function TableIndexResult({ loading, pageIndex, pageSize, total }: TableIndexResultProp) {
  const { t } = useI18n();
  if (loading) return <Skeleton className="h-[24px] w-[250px]" />;

  let to = pageSize * pageIndex;
  const from = to - pageSize + 1;

  if (to > total) {
    to = total;
  }

  return (
    <span className="text-xs text-muted-foreground">
      {t('common.table.results')} {thousandNumberFormat(from)} - {thousandNumberFormat(to)} of{' '}
      {thousandNumberFormat(total)}
    </span>
  );
}

export default TableIndexResult;
