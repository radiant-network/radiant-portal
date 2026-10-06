import { useMemo } from 'react';

import type { PatientEntity } from '@/api/api';
import DisplayTable from '@/components/base/data-table/display-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { toTreatmentRows } from './treatment-rows';
import { getTreatmentsColumns } from './treatments-table-settings';

type TreatmentsTabProps = {
  patient?: PatientEntity;
  isLoading: boolean;
};

function TreatmentsTab({ patient, isLoading }: TreatmentsTabProps) {
  const { t } = useI18n();

  const columns = useMemo(() => getTreatmentsColumns(t), [t]);
  const rows = useMemo(() => (patient ? toTreatmentRows(patient) : []), [patient]);

  return (
    <Card>
      <CardHeader className="border-b [.border-b]:pb-2">
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <CardTitle>{t('patient_entity.treatments.title_count', { count: rows.length })}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {isLoading ? <Skeleton className="h-48 w-full" /> : <DisplayTable data={rows} columns={columns} fullHeight />}
      </CardContent>
    </Card>
  );
}

export default TreatmentsTab;
