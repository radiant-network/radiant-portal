import { Button } from '@/components/base/ui/button';
import { Card, CardContent, CardDescription, CardAction, CardHeader, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/base/ui/input';
import DataTable from '@/components/base/data-table/data-table';
import { getPathogenicEvidenceColumns, pathogenicEvidenceDefaultSettings } from './table-settings';
import { useState } from 'react';
import useSWR from 'swr';
import { variantsApi } from '@/utils/api';
import { useParams } from 'react-router';
import { ApiError, ClinvarRCV } from '@/api/api';

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
        <CardTitle className="text-xl font-semibold">{t('variantEntity.evidence.clinVar.title')}</CardTitle>
        <CardDescription>{t('variantEntity.evidence.clinVar.description')}</CardDescription>
        <CardAction>
          <Button variant="outline">
            ClinVar <ExternalLink />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          startIcon={Search}
          placeholder={t('variantEntity.evidence.clinVar.filters.searchPlaceholder')}
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
          paginationHidden
          total={filteredData.length}
          tableIndexResultPosition="bottom"
        />
      </CardContent>
    </Card>
  );
}

export default ClinVarCard;
