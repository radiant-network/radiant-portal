import InformationField from '@/components/base/information/information-field';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

type InitialDiagnosisCardProps = {
  cns_diagnosis_category?: string;
  cns_integrated_diagnosis?: string;
  event_date?: string;
  source_of_event_diagnosis?: string;
  date_of_initial_diagnosis_mri?: string;
  event_count?: number;
  onViewTimeline?: () => void;
} & CardProps;

function InitialDiagnosisCard({
  cns_diagnosis_category,
  cns_integrated_diagnosis,
  event_date,
  source_of_event_diagnosis,
  date_of_initial_diagnosis_mri,
  event_count,
  onViewTimeline,
  ...cardProps
}: InitialDiagnosisCardProps) {
  const { t } = useI18n();

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
        {event_date && (
          <InformationField label={t('patient_entity.overview.initial_diagnosis.event_date')}>
            {event_date}
          </InformationField>
        )}
        {source_of_event_diagnosis && (
          <InformationField label={t('patient_entity.overview.initial_diagnosis.source_of_event_diagnosis')}>
            {source_of_event_diagnosis}
          </InformationField>
        )}
        {date_of_initial_diagnosis_mri && (
          <InformationField label={t('patient_entity.overview.initial_diagnosis.date_of_initial_diagnosis_mri')}>
            {date_of_initial_diagnosis_mri}
          </InformationField>
        )}
      </CardContent>
    </Card>
  );
}

export default InitialDiagnosisCard;
