import { ComponentProps } from 'react';

import { CaseEntity } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { defaultSettings, getColumns } from './tables/sequencing-table-settings';

type SequencingExperimentInformationsCardProps = ComponentProps<'div'> & {
  data: CaseEntity;
};
function SequencingExperimentInformationsCard({ data, ...props }: SequencingExperimentInformationsCardProps) {
  const { t } = useI18n();

  return (
    <Card {...props}>
      <CardHeader className="border-b [.border-b]:pb-4">
        <CardTitle size="xl">{t('case_entity.details.sequencing_overview')}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          id="sequencing-experiments"
          columns={getColumns(t)}
          defaultColumnSettings={defaultSettings}
          data={data.sequencing_experiments}
          loadingStates={{
            total: false,
            list: false,
          }}
          total={data.sequencing_experiments.length}
          pagination={{ type: 'hidden' }}
          tableIndexResultPosition="hidden"
        />
      </CardContent>
    </Card>
  );
}
export default SequencingExperimentInformationsCard;
