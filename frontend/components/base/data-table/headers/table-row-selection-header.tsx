import type { Table } from '@tanstack/react-table';

import { Checkbox } from '@/components/base/shadcn/checkbox';
import { useI18n } from '@/components/hooks/i18n';

import type { AppFeatures } from '../data-table';

type RowSelectionHeaderProps = {
  table: Table<AppFeatures, any>;
};

function RowSelectionHeader({ table }: RowSelectionHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-center w-full">
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t('a11y.data_table.select_page_rows')}
      />
    </div>
  );
}

export default RowSelectionHeader;
