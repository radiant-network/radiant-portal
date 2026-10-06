import SkeletonCard from '@/components/base/cards/skeleton-card';
import InformationField from '@/components/base/information/information-field';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

type InitialDiagnosisCardProps = {
  cns_diagnosis_category?: string;
  cns_integrated_diagnosis?: string;
  event_day?: number;
  event_count?: number;
  onViewTimeline?: () => void;
  isLoading?: boolean;
} & CardProps;

function InitialDiagnosisCard({
  cns_diagnosis_category,
  cns_integrated_diagnosis,
  event_day,
  event_count,
  onViewTimeline,
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
      <CardHeader className="flex flex-row items-center justify-between border-b [.border-b]:pb-2">
        <CardTitle>{t('patient_entity.overview.initial_diagnosis.title')}</CardTitle>
        <div className="flex items-center gap-2">
          {event_count !== undefined && (
            <span className="text-muted-foreground text-xs">
              {t('patient_entity.overview.initial_diagnosis.events_total', { count: event_count })}
            </span>
          )}
          {onViewTimeline && (
            <Button variant="outline" size="xs" onClick={onViewTimeline}>
              {t('patient_entity.overview.initial_diagnosis.view_timeline')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {cns_diagnosis_category && (
          <InformationField label={t('patient_entity.overview.initial_diagnosis.cns_diagnosis_category')}>
            {cns_diagnosis_category}
          </InformationField>
        )}
        {cns_integrated_diagnosis && (
          <InformationField label={t('patient_entity.overview.initial_diagnosis.cns_integrated_diagnosis')}>
            {cns_integrated_diagnosis}
          </InformationField>
        )}
        {event_day !== undefined && (
          <InformationField label={t('patient_entity.overview.initial_diagnosis.event_date')}>
            {t('patient_entity.overview.initial_diagnosis.day', { day: event_day })}
          </InformationField>
        )}
      </CardContent>
    </Card>
  );
}

export default InitialDiagnosisCard;
