import { useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

import { ApiError, VariantCasesCount, VariantCasesFilters } from '@/api/api';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { Card, CardContent } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { tabContentClassName } from '@/style';
import { variantsApi } from '@/utils/api';

import { CasesFiltersProvider } from './cases-filters-context';
import InterpretedCasesTable from './interpreted-cases-table';
import UninterpretedCasesTable from './uninterpreted-cases-table';

enum Tabs {
  InterpretedCases = 'InterpretedCases',
  OtherCases = 'OtherCases',
}

type CasesCountInput = {
  key: string;
  locusId: string;
};

async function fetchCasesCount(input: CasesCountInput) {
  const response = await variantsApi.getGermlineVariantCasesCount(input.locusId);
  return response.data;
}

async function fetchCasesFilters() {
  const response = await variantsApi.getGermlineVariantCasesFilters();
  return response.data;
}

function CasesTab() {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.InterpretedCases);

  const { data } = useSWR<VariantCasesCount, ApiError, CasesCountInput>(
    {
      key: 'cases-count',
      locusId: params.locusId!,
    },
    fetchCasesCount,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const filtersQuery = useSWR<VariantCasesFilters, ApiError, string>('cases-filters', fetchCasesFilters);

  return (
    <div className={tabContentClassName}>
      <CasesFiltersProvider filters={filtersQuery.data} isLoading={filtersQuery.isLoading}>
        <Card>
          <CardContent className="space-y-3">
            <TabsNav value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsListItem value={Tabs.InterpretedCases}>
                  {t('variant_entity.cases.interpreted_table.title', {
                    count: data?.count_interpreted,
                  })}
                </TabsListItem>
                <TabsListItem value={Tabs.OtherCases}>
                  {t('variant_entity.cases.other_table.title', {
                    count: data?.count_uninterpreted,
                  })}
                </TabsListItem>
              </TabsList>
              <TabsContent value={Tabs.InterpretedCases}>
                <InterpretedCasesTable />
              </TabsContent>
              <TabsContent value={Tabs.OtherCases}>
                <UninterpretedCasesTable />
              </TabsContent>
            </TabsNav>
          </CardContent>
        </Card>
      </CasesFiltersProvider>
    </div>
  );
}

export default CasesTab;
