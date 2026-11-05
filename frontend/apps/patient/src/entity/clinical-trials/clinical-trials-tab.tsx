import { useMemo } from 'react';

import type { PatientEntity } from '@/api/api';
import DisplayTable from '@/components/base/data-table/display-table';
import Empty from '@/components/base/empties/empty';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { usePatientTreatments, usePatientTrialEligibilities } from '../hooks/use-patient-entity';

import { getClinicalTrialsColumns } from './clinical-trials-table-settings';
import TrialEligibilityCard from './trial-eligibility-card';

type ClinicalTrialsTabProps = {
  patient?: PatientEntity;
};

function ClinicalTrialsTab({ patient }: ClinicalTrialsTabProps) {
  const { t } = useI18n();
  const { data: treatments, isLoading } = usePatientTreatments();
  const { data: eligibilities } = usePatientTrialEligibilities();

  const columns = useMemo(() => getClinicalTrialsColumns(t), [t]);
  const rows = treatments?.trial_enrollments ?? [];
  const assessments = eligibilities?.assessments ?? [];
  const canReadPhi = patient?.can_read_phi ?? false;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader bordered>
          <CardTitle>{t('patient_entity.clinical_trials.trial_eligibilities.title')}</CardTitle>
          {assessments.length > 0 && (
            <CardDescription>{t('patient_entity.clinical_trials.trial_eligibilities.subtitle')}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {assessments.length > 0 ? (
            <div className="lg:overflow-hidden lg:rounded-lg lg:border">
              {assessments.map((assessment, index) => (
                <TrialEligibilityCard
                  key={`${assessment.variable_name}-${assessment.loaded_at}-${index}`}
                  assessment={assessment}
                  canReadPhi={canReadPhi}
                />
              ))}
            </div>
          ) : (
            <Empty
              size="inline"
              showIcon={false}
              description={t('patient_entity.clinical_trials.trial_eligibilities.empty')}
            />
          )}
        </CardContent>
      </Card>
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
    </div>
  );
}

export default ClinicalTrialsTab;
