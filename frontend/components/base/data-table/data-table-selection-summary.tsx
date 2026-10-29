import type { ReactNode } from 'react';

import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

type TableSelectionSummaryProps = {
  count: number;
  children?: ReactNode;
};

function TableSelectionSummary({ count, children }: TableSelectionSummaryProps) {
  const { t } = useI18n();

  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground" data-cy="table-selection-summary">
      {t('common.table.items_selected', { count, value: thousandNumberFormat(count) })}
      {children}
    </span>
  );
}

export default TableSelectionSummary;
