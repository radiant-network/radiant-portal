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
  isLoading?: boolean;
} & CardProps;

function TumourAndMetastasisCard({
  tumor_locations,
  tumor_location_other,
  metastasis,
  metastasis_locations,
  metastasis_location_other,
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
      <CardHeader bordered>
        <CardTitle>{t('patient_entity.overview.tumour_and_metastasis.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <InformationField label={t('patient_entity.overview.tumour_and_metastasis.tumor_locations')}>
          {tumor_locations?.join(', ')}
        </InformationField>
        <InformationField label={t('patient_entity.overview.tumour_and_metastasis.tumor_location_other')}>
          {tumor_location_other}
        </InformationField>
        <InformationField label={t('patient_entity.overview.tumour_and_metastasis.metastasis')}>
          {metastasis}
        </InformationField>
        <InformationField label={t('patient_entity.overview.tumour_and_metastasis.metastasis_locations')}>
          {metastasis_locations?.join(', ')}
        </InformationField>
        <InformationField label={t('patient_entity.overview.tumour_and_metastasis.metastasis_location_other')}>
          {metastasis_location_other}
        </InformationField>
      </CardContent>
    </Card>
  );
}

export default TumourAndMetastasisCard;
