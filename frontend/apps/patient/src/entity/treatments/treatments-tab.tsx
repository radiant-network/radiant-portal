import { useMemo } from 'react';

import DisplayTable from '@/components/base/data-table/display-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { usePatientTreatments } from '../hooks/use-patient-entity';

import { toTreatmentRows } from './treatment-rows';
import { getTreatmentsColumns } from './treatments-table-settings';

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
      <CardContent className="flex flex-col gap-2">
        <DisplayTable data={rows} columns={columns} loading={isLoading} fullHeight />
      </CardContent>
    </Card>
  );
}

export default TreatmentsTab;
