import { useMemo } from 'react';

import DisplayTable from '@/components/base/data-table/display-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { usePatientTreatments } from '../hooks/use-patient-entity';

import { getClinicalTrialsColumns } from './clinical-trials-table-settings';

function ClinicalTrialsTab() {
  const { t } = useI18n();
  const { data: treatments, isLoading } = usePatientTreatments();

  const columns = useMemo(() => getClinicalTrialsColumns(t), [t]);
  const rows = treatments?.trial_enrollments ?? [];

  return (
    <Card>
      <CardHeader bordered>
        {isLoading ? (
          <Skeleton className="h-5 w-48" />
        ) : (
          <CardTitle>{t('patient_entity.clinical_trials.title_count', { count: rows.length })}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <DisplayTable data={rows} columns={columns} loading={isLoading} fullHeight />
        {!isLoading && rows.length > 0 && (
          <p className="text-muted-foreground text-sm">{t('patient_entity.clinical_trials.footer')}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default ClinicalTrialsTab;
