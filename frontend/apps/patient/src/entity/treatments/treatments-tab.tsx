import { useMemo } from 'react';

import DataTable, { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { usePatientTreatments } from '../hooks/use-patient-entity';

import { toTreatmentRows } from './treatment-rows';
import { defaultTreatmentsSettings, getTreatmentsColumns } from './treatments-table-settings';

function TreatmentsTab() {
  const { t } = useI18n();
  const { data: treatments, isLoading } = usePatientTreatments();

  const columns = useMemo(() => getTreatmentsColumns(t), [t]);
  const rows = useMemo(() => (treatments ? toTreatmentRows(treatments) : []), [treatments]);

  return (
    <Card>
      <CardHeader bordered>
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <CardTitle>{t('patient_entity.treatments.title_count', { count: rows.length })}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <DataTable
          id="patient-treatments"
          columns={columns}
          data={rows}
          defaultColumnSettings={defaultTreatmentsSettings}
          pagination={{ type: 'locale', state: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE } }}
          total={rows.length}
          loadingStates={{ total: isLoading, list: isLoading }}
          tableIndexResultPosition="bottom"
        />
      </CardContent>
    </Card>
  );
}

export default TreatmentsTab;
