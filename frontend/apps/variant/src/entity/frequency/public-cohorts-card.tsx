import { useParams } from 'react-router';
import useSWR from 'swr';

import { ApiError, VariantExternalFrequencies } from '@/api/index';
import DisplayTable from '@/components/base/data-table/display-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';
import { variantsApi } from '@/utils/api';

import { getPublicCohortsColumns } from './table-settings';

async function fetchPublicCohorts(locusId: string): Promise<VariantExternalFrequencies> {
  const response = await variantsApi.getGermlineVariantExternalFrequencies(locusId);
  return response.data;
}

function PublicCohortsCard() {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  const { data } = useSWR<VariantExternalFrequencies, ApiError, string>(
    `public-cohorts-${params.locusId}`,
    () => fetchPublicCohorts(params.locusId!),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('variant_entity.frequency.public_cohorts.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <DisplayTable
          dataCy="public-cohorts-table"
          columns={getPublicCohortsColumns(t, data?.locus)}
          data={data?.external_frequencies || []}
        />
      </CardContent>
    </Card>
  );
}

export default PublicCohortsCard;
