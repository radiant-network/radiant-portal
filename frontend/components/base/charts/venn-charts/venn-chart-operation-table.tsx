import { useMemo } from 'react';
import { createColumnHelper, OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { User } from 'lucide-react';

import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

import { TableColumnDef } from '../../data-table/data-table';
import DisplayTable from '../../data-table/display-table';
import { Checkbox } from '../../shadcn/checkbox';

import { VennOperation } from './venn-chart';

const columnHelper = createColumnHelper<VennOperation>();

type VennChartOperationTableProps = {
  data: VennOperation[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
};

/**
 * @TODO: Missing open set in query builder because radiant's query builder doesn't support Set at the moment.
 * @TODO: User icon is always displayed, a dynamique icon system should be added in the futur (participant, variant etc.)
 */
function VennChartOperationTable({ data, rowSelection, onRowSelectionChange }: VennChartOperationTableProps) {
  const { t } = useI18n();
  const columns = useMemo(
    () =>
      [
        {
          id: 'checkbox',
          cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={row.getToggleSelectedHandler()} />
          ),
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsSomeRowsSelected() ? 'indeterminate' : table.getIsAllRowsSelected()}
              onCheckedChange={(checked: boolean) => {
                table.toggleAllRowsSelected(checked);
              }}
            />
          ),
          footer: <span className="ml-2">{t('analysis.set_operations.union_of_selected_set')}</span>,
          meta: { footerColSpan: 2 },
        },
        columnHelper.accessor('operation', {
          header: t('analysis.set_operations.set_definition'),
          meta: { footerColSpan: 0 },
        }),
        columnHelper.accessor('count', {
          header: () => <User size={16} />,
          cell: info => thousandNumberFormat(info.getValue()),
          footer: ({ table }) => {
            const total = table.getSelectedRowModel().rows.reduce((sum, row) => sum + row.original.count, 0);
            return <span className="ml-2">{thousandNumberFormat(total)}</span>;
          },
        }),
      ] as TableColumnDef<VennOperation, any>[],
    [t],
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg">{t('analysis.set_operations.set_definitions')}</span>
      <DisplayTable
        columns={columns}
        data={data}
        dataCy="venn-set-operations-table"
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
      />
    </div>
  );
}
export default VennChartOperationTable;
