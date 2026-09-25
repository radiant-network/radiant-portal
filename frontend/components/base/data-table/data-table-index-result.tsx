import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

/**
 * TableIndexResult
 * show current page and total page
 */
type TableIndexResultProp = {
  total: number;
  filteredTotal: number;
  loading?: boolean;
  pageIndex: number;
  pageSize: number;
};

function getPaginationRange(pageSize: number, pageIndex: number, total: number) {
  let to = pageSize * pageIndex;
  const from = to - pageSize + 1;

  if (to > total) {
    to = total;
  }

  return {
    to,
    from,
  };
}

function TableIndexResult({ loading, pageIndex, pageSize, total, filteredTotal }: TableIndexResultProp) {
  const { t } = useI18n();
  if (loading) return <Skeleton className="h-[24px] w-[250px]" />;
  if (total === 0) {
    return (
      <span className="text-xs text-muted-foreground" data-cy="table-index-result">
        {t('common.table.no_result')}
      </span>
    );
  }

  const targetTotal = total != filteredTotal ? filteredTotal : total;

  const { to, from } = getPaginationRange(pageSize, pageIndex, targetTotal);

  return (
    <span className="text-xs text-muted-foreground" data-cy="table-index-result">
      {total != filteredTotal ? (
        <>
          {t('common.table.results_filtered', {
            shown: thousandNumberFormat(filteredTotal),
            total: thousandNumberFormat(total),
          })}
        </>
      ) : (
        <>
          {t('common.table.results', {
            from: thousandNumberFormat(from),
            to: thousandNumberFormat(to),
            total: thousandNumberFormat(total),
          })}
        </>
      )}
    </span>
  );
}

export default TableIndexResult;
