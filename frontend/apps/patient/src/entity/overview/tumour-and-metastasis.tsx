import InformationField from '@/components/base/information/information-field';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

type TumourAndMetastasisCardProps = {
  tumor_locations?: string[];
  tumor_location_other?: string;
  laterality?: string;
  metastasis?: string;
  m_stage?: string;
  metastasis_location?: string[];
  metastasis_location_other?: string;
  symptoms_at_event?: string[];
  event_type?: string;
  event_day?: number;
} & CardProps;

function TumourAndMetastasisCard({
  tumor_locations,
  tumor_location_other,
  laterality,
  metastasis,
  m_stage,
  metastasis_location,
  metastasis_location_other,
  symptoms_at_event,
  event_type,
  event_day,
  ...cardProps
}: TumourAndMetastasisCardProps) {
  const { t } = useI18n();

  return (
    <Card data-cy="tumour-and-metastasis-card" {...cardProps}>
      <CardHeader className="flex flex-row items-center justify-between border-b [.border-b]:pb-2">
        <CardTitle>{t('patient_entity.overview.tumour_and_metastasis.title')}</CardTitle>
        {event_type && event_day !== undefined && (
          <span className="text-muted-foreground text-xs">
            {t('patient_entity.overview.tumour_and_metastasis.most_recent_event', {
              type: event_type,
              day: event_day,
            })}
          </span>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {tumor_locations && tumor_locations.length > 0 && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.tumor_locations')}>
            {tumor_locations.join(', ')}
          </InformationField>
        )}
        {tumor_location_other && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.tumor_location_other')}>
            {tumor_location_other}
          </InformationField>
        )}
        {laterality && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.laterality')}>
            {laterality}
          </InformationField>
        )}
        {metastasis && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.metastasis')}>
            {metastasis}
          </InformationField>
        )}
        {m_stage && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.m_stage')}>
            {m_stage}
          </InformationField>
        )}
        {metastasis_location && metastasis_location.length > 0 && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.metastasis_location')}>
            {metastasis_location.join(', ')}
          </InformationField>
        )}
        {metastasis_location_other && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.metastasis_location_other')}>
            {metastasis_location_other}
          </InformationField>
        )}
        {symptoms_at_event && symptoms_at_event.length > 0 && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.symptoms_at_event')}>
            {symptoms_at_event.join(', ')}
          </InformationField>
        )}
      </CardContent>
    </Card>
  );
}

export default TumourAndMetastasisCard;
