import { useState } from 'react';
import { useParams } from 'react-router';
import { ExternalLink, Search } from 'lucide-react';
import useSWR from 'swr';

import { ApiError, ClinvarRCV } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/ui/card';
import { Input } from '@/components/base/ui/input';
import { useI18n } from '@/components/hooks/i18n';
import { variantsApi } from '@/utils/api';

import { getPathogenicEvidenceColumns, pathogenicEvidenceDefaultSettings } from './table-settings';

type ClinVarConditionsSearchInput = {
  key: string;
  locusId: string;
};

async function fetchClinVarConditions(input: ClinVarConditionsSearchInput) {
  const response = await variantsApi.getGermlineVariantConditionsClinvar(input.locusId);
  return response.data;
}

function ClinVarCard() {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useSWR<ClinvarRCV[], ApiError, ClinVarConditionsSearchInput>(
    {
      key: 'interpreted-cases',
      locusId: params.locusId!,
    },
    fetchClinVarConditions,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const filteredData =
    data?.filter(item => {
      if (!search.trim()) return true;

      const traits = item.traits || [];
      return traits.some(trait => trait?.toLowerCase().includes(search.toLowerCase()));
    }) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t('variant_entity.evidence.clin_var.title')}</CardTitle>
        <CardDescription>{t('variant_entity.evidence.clin_var.description')}</CardDescription>
        <CardAction>
          <Button variant="outline">
            ClinVar <ExternalLink />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          startIcon={Search}
          placeholder={t('variant_entity.evidence.clin_var.filters.search_placeholder')}
          wrapperClassName="max-w-[320px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <DataTable
          id="pathogenic-evidence"
          columns={getPathogenicEvidenceColumns(t)}
          data={filteredData}
          defaultColumnSettings={pathogenicEvidenceDefaultSettings}
          defaultServerSorting={[]}
          loadingStates={{
            total: isLoading,
            list: isLoading,
          }}
          pagination={{ type: 'hidden' }}
          total={filteredData.length}
          tableIndexResultPosition="bottom"
        />
      </CardContent>
    </Card>
  );
}

export default ClinVarCard;
