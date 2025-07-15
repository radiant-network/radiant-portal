
import { ComponentProps, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { CaseEntity, SortBody, SortBodyOrderEnum } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { defaultSettings, getSequencingAndAssaysColumns } from '@/feature/sequencing-and-assays-table/table-settings';

const DEFAULT_SORTING = [
  {
    field: 'created_at',
    order: SortBodyOrderEnum.Asc,
  },
];

type SequencingAndAssayInformationsCardProps = ComponentProps<'div'> & {
  data: CaseEntity;
};
function SequencingAndAssayInformationsCard({ data, ...props }: SequencingAndAssayInformationsCardProps) {
  const { t } = useI18n();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <Card {...props}>
      <CardHeader className="border-b [.border-b]:pb-4">
        <CardTitle size="xl">{t('caseEntity.details.SequencingAndAssayInformationsOverview')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <DataTable
          id="sequencing-and-assays"
          columns={getSequencingAndAssaysColumns(t)}
          defaultColumnSettings={defaultSettings}
          data={data.assays}
          loadingStates={{
            total: false,
            list: false,
          }}
          total={data.assays.length}
          pagination={pagination}
          defaultServerSorting={DEFAULT_SORTING}
          onPaginationChange={setPagination}
          tableIndexResultPosition="hidden"
        />
      </CardContent>
    </Card>
  );
}
export default SequencingAndAssayInformationsCard;
