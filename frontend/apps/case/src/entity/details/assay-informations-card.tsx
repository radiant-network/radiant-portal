import { ComponentProps } from 'react';

import { CaseEntity, SortBodyOrderEnum } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { defaultSettings, getColumns } from './tables/assays-table-settings';

const DEFAULT_SORTING = [
  {
    field: 'created_at',
    order: SortBodyOrderEnum.Asc,
  },
];

type AssayInformationsCardProps = ComponentProps<'div'> & {
  data: CaseEntity;
};
function AssayInformationsCard({ data, ...props }: AssayInformationsCardProps) {
  const { t } = useI18n();

  return (
    <Card {...props}>
      <CardHeader className="border-b [.border-b]:pb-4">
        <CardTitle size="xl">{t('case_entity.details.assay_informations_overview')}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          id="sequencing-and-assays"
          columns={getColumns(t)}
          defaultColumnSettings={defaultSettings}
          data={data.assays}
          loadingStates={{
            total: false,
            list: false,
          }}
          total={data.assays.length}
          pagination={{ type: 'hidden' }}
          tableIndexResultPosition="hidden"
          serverOptions={{
            defaultSorting: DEFAULT_SORTING,
          }}
        />
      </CardContent>
    </Card>
  );
}
export default AssayInformationsCard;
