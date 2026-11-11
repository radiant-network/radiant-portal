import { useI18n } from '@/components/hooks/i18n';

import TableSelectionSummary from '../data-table/data-table-selection-summary';
import { Button } from '../shadcn/button';

import type { TableSelection } from './hooks/use-table-selection';

type QueryBuilderSelectionSummaryProps = {
  selection: TableSelection;
};

function QueryBuilderSelectionSummary({ selection }: QueryBuilderSelectionSummaryProps) {
  const { t } = useI18n();

  return (
    <TableSelectionSummary count={selection.selectedCount}>
      {selection.canSelectAll ? (
        <Button variant="link" className="h-auto p-0 text-xs" onClick={selection.selectAll}>
          {t('common.table.select_all')}
        </Button>
      ) : (
        <Button variant="link" className="h-auto p-0 text-xs" onClick={selection.clear}>
          {t('common.table.clear_selection')}
        </Button>
      )}
    </TableSelectionSummary>
  );
}

export default QueryBuilderSelectionSummary;
