import { useMemo } from 'react';
import useSWR from 'swr';

import DisplayTable from '@/components/base/data-table/display-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { fetchPatientTreatments, type PatientTreatments } from '../../api/patient';

import { toTreatmentRows } from './treatment-rows';
import { getTreatmentsColumns } from './treatments-table-settings';

type TreatmentsTabProps = {
  patientId: string;
};

function TreatmentsTab({ patientId }: TreatmentsTabProps) {
  const { t } = useI18n();
  const { data, isLoading } = useSWR<PatientTreatments>(['patient-treatments', patientId], () =>
    fetchPatientTreatments(patientId),
  );

  const columns = useMemo(() => getTreatmentsColumns(t), [t]);
  const rows = useMemo(() => (data ? toTreatmentRows(data) : []), [data]);

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
