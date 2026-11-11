import SkeletonCard from '@/components/base/cards/skeleton-card';
import InformationField from '@/components/base/information/information-field';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

type InitialDiagnosisCardProps = {
  cns_diagnosis_category?: string;
  cns_integrated_diagnosis?: string;
  event_day?: number;
  initial_tumor_resections?: string[];
  tumor_locations?: string[];
  tumor_location_other?: string;
  metastasis?: string;
  isLoading?: boolean;
} & CardProps;

function InitialDiagnosisCard({
  cns_diagnosis_category,
  cns_integrated_diagnosis,
  event_day,
  initial_tumor_resections,
  tumor_locations,
  tumor_location_other,
  metastasis,
  isLoading,
  ...cardProps
}: InitialDiagnosisCardProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <SkeletonCard
        data-cy="initial-diagnosis-card"
        title={t('patient_entity.overview.initial_diagnosis.title')}
        rows={7}
        {...cardProps}
      />
    );
  }

  return (
    <Card data-cy="initial-diagnosis-card" {...cardProps}>
      <CardHeader bordered>
        <CardTitle>{t('patient_entity.overview.initial_diagnosis.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <InformationField label={t('patient_entity.overview.initial_diagnosis.cns_diagnosis_category')}>
          {cns_diagnosis_category}
        </InformationField>
        <InformationField label={t('patient_entity.overview.initial_diagnosis.cns_integrated_diagnosis')}>
          {cns_integrated_diagnosis}
        </InformationField>
        <InformationField label={t('patient_entity.overview.initial_diagnosis.event_date')}>
          {event_day !== undefined ? t('patient_entity.overview.initial_diagnosis.day', { day: event_day }) : undefined}
        </InformationField>
        <InformationField label={t('patient_entity.overview.initial_diagnosis.tumor_locations')}>
          {tumor_locations?.length ? tumor_locations.join(', ') : undefined}
        </InformationField>
        <InformationField label={t('patient_entity.overview.initial_diagnosis.tumor_location_other')}>
          {tumor_location_other}
        </InformationField>
        <InformationField label={t('patient_entity.overview.initial_diagnosis.metastasis')}>
          {metastasis}
        </InformationField>
        <InformationField label={t('patient_entity.overview.initial_diagnosis.initial_tumor_resections')}>
          {initial_tumor_resections?.length ? initial_tumor_resections.join(', ') : undefined}
        </InformationField>
      </CardContent>
    </Card>
  );
}

export default InitialDiagnosisCard;
