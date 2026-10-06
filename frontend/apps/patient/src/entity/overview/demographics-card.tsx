import SkeletonCard from '@/components/base/cards/skeleton-card';
import InformationField from '@/components/base/information/information-field';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

type DemographicsCardProps = {
  mrn?: string;
  birth_year?: number;
  gender?: string;
  race?: string;
  ethnicity?: string;
  postal_code?: string;
  organization_name?: string;
  isLoading?: boolean;
} & CardProps;

function DemographicsCard({
  mrn,
  birth_year,
  gender,
  race,
  ethnicity,
  postal_code,
  organization_name,
  isLoading,
  ...cardProps
}: DemographicsCardProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <SkeletonCard
        data-cy="demographics-card"
        title={t('patient_entity.overview.demographics.title')}
        rows={6}
        {...cardProps}
      />
    );
  }

  return (
    <Card data-cy="demographics-card" {...cardProps}>
      <CardHeader className="border-b [.border-b]:pb-2">
        <CardTitle>{t('patient_entity.overview.demographics.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {mrn && <InformationField label={t('patient_entity.overview.demographics.mrn')}>{mrn}</InformationField>}
        {birth_year !== undefined && (
          <InformationField label={t('patient_entity.overview.demographics.birth_year')}>{birth_year}</InformationField>
        )}
        {gender && (
          <InformationField label={t('patient_entity.overview.demographics.gender')}>{gender}</InformationField>
        )}
        {race && <InformationField label={t('patient_entity.overview.demographics.race')}>{race}</InformationField>}
        {ethnicity && (
          <InformationField label={t('patient_entity.overview.demographics.ethnicity')}>{ethnicity}</InformationField>
        )}
        {postal_code && (
          <InformationField label={t('patient_entity.overview.demographics.postal_code')}>
            {postal_code}
          </InformationField>
        )}
        {organization_name && (
          <InformationField label={t('patient_entity.overview.demographics.organization_name')}>
            {organization_name}
          </InformationField>
        )}
      </CardContent>
    </Card>
  );
}

export default DemographicsCard;
