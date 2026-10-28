import SkeletonCard from '@/components/base/cards/skeleton-card';
import InformationField from '@/components/base/information/information-field';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

type InitialDiagnosisCardProps = {
  cns_diagnosis_category?: string;
  cns_integrated_diagnosis?: string;
  event_day?: number;
  isLoading?: boolean;
} & CardProps;

function InitialDiagnosisCard({
  cns_diagnosis_category,
  cns_integrated_diagnosis,
  event_day,
  isLoading,
  ...cardProps
}: InitialDiagnosisCardProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <SkeletonCard
        data-cy="initial-diagnosis-card"
        title={t('patient_entity.overview.initial_diagnosis.title')}
        rows={3}
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
      </CardContent>
    </Card>
  );
}

export default InitialDiagnosisCard;
