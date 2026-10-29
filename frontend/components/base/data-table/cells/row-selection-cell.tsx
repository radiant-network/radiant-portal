import type { Row } from '@tanstack/react-table';

import { Checkbox } from '@/components/base/shadcn/checkbox';
import { useI18n } from '@/components/hooks/i18n';

import type { AppFeatures } from '../data-table';

type TableRowSelectionCellProps = {
  row: Row<AppFeatures, any>;
};

function RowSelectionCell({ row }: TableRowSelectionCellProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label={t('a11y.data_table.select_row')}
      />
    </div>
  );
}

export default RowSelectionCell;
