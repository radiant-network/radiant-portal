import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';
import type { QuickfiltersProps } from 'components/base/data-table/data-table';

/**
 * TableIndexResult
 * show current page and total page
 */
type TableIndexResultProp = {
  total: number;
  quickfilters?: QuickfiltersProps;
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

function TableIndexResult({
  loading,
  pageIndex,
  pageSize,
  total,
  quickfilters = { enabled: false },
}: TableIndexResultProp) {
  const { t } = useI18n();
  if (loading) return <Skeleton className="h-[24px] w-[250px]" />;
  if (total === 0) {
    return (
      <span className="text-xs text-muted-foreground" data-cy="table-index-result">
        {t('common.table.no_result')}
      </span>
    );
  }

  // Gate on `enabled` only: with an active filter, `total === 0` means "no match"
  // and must still read as "0 shown of Y", not fall back to the unfiltered format.
  const shown = quickfilters.total ?? 0;
  const targetTotal = quickfilters.enabled ? shown : total;

  const { to, from } = getPaginationRange(pageSize, pageIndex, targetTotal);

  return (
    <span className="text-xs text-muted-foreground" data-cy="table-index-result">
      {quickfilters.enabled ? (
        <>
          {t('common.table.results_filtered', {
            shown: thousandNumberFormat(shown),
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
