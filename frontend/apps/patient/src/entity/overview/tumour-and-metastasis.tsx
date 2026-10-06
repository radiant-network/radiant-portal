import SkeletonCard from '@/components/base/cards/skeleton-card';
import InformationField from '@/components/base/information/information-field';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

type TumourAndMetastasisCardProps = {
  tumor_locations?: string[];
  tumor_location_other?: string;
  metastasis?: string;
  metastasis_locations?: string[];
  metastasis_location_other?: string;
  event_type?: string;
  event_day?: number;
  isLoading?: boolean;
} & CardProps;

function TumourAndMetastasisCard({
  tumor_locations,
  tumor_location_other,
  metastasis,
  metastasis_locations,
  metastasis_location_other,
  event_type,
  event_day,
  isLoading,
  ...cardProps
}: TumourAndMetastasisCardProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <SkeletonCard
        data-cy="tumour-and-metastasis-card"
        title={t('patient_entity.overview.tumour_and_metastasis.title')}
        rows={4}
        {...cardProps}
      />
    );
  }

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
        {metastasis && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.metastasis')}>
            {metastasis}
          </InformationField>
        )}
        {metastasis_locations && metastasis_locations.length > 0 && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.metastasis_locations')}>
            {metastasis_locations.join(', ')}
          </InformationField>
        )}
        {metastasis_location_other && (
          <InformationField label={t('patient_entity.overview.tumour_and_metastasis.metastasis_location_other')}>
            {metastasis_location_other}
          </InformationField>
        )}
      </CardContent>
    </Card>
  );
}

export default TumourAndMetastasisCard;
