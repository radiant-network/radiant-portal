import { useMemo } from 'react';
import DisplayTable from '@/components/base/data-table/display-table';
import { createColumnHelper } from '@tanstack/react-table';
import { TableColumnDef } from '@/components/base/data-table/data-table';
import { VennSummary } from './venn-chart';
import { useI18n } from '@/components/hooks/i18n';
import { User } from 'lucide-react';

const columnHelper = createColumnHelper<VennSummary>();

type VennChartSummaryTableProps = {
  data: VennSummary[];
};

/**
 * @TODO: Applications doesn't support sets at the moment (set_id:uuid cannot be read)
 * @TODO: User icon is always displayed, a dynamique icon system should be added in the futur (participant, variant etc.)
 */
function VennChartSummaryTable({ data }: VennChartSummaryTableProps) {
  const { t } = useI18n();
  const columns = useMemo(
    () =>
      [
        columnHelper.accessor('operation', {
          cell: info => info.getValue(),
          header: '',
        }),
        columnHelper.accessor('sqon', {
          cell: info => <>{info.getValue().content[0].content.value.join(',')}</>,
          header: t('analysis.set_operations.set_definition'),
        }),
        columnHelper.accessor('count', {
          header: () => <User size={16} />,
        }),
      ] as TableColumnDef<VennSummary, any>[],
    [t],
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg">{t('analysis.set_operations.selected_sets')}</span>
      <DisplayTable columns={columns} data={data} dataCy="venn-set-summary-table" />
    </div>
  );
}
export default VennChartSummaryTable;
