import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { useState } from 'react';
import InterpretedCasesTable from './interpreted-cases-table';
import UninterpretedCasesTable from './uninterpreted-cases-table';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { variantsApi } from '@/utils/api';
import useSWR from 'swr';
import { ApiError, VariantCasesCount, VariantCasesFilters } from '@/api/api';
import { useParams } from 'react-router';
import { Skeleton } from '@/components/base/ui/skeleton';
import { CasesFiltersProvider } from './cases-filters-context';

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

  const { data, isLoading } = useSWR<VariantCasesCount, ApiError, CasesCountInput>(
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
    <CasesFiltersProvider filters={filtersQuery.data} isLoading={filtersQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {isLoading ? (
              <Skeleton className="w-20 h-7" />
            ) : (
              t('variantEntity.cases.title', {
                count: data?.count_total_cases,
              })
            )}
          </CardTitle>
          <CardDescription>{t('variantEntity.cases.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TabsNav value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsListItem value={Tabs.InterpretedCases}>
                {t('variantEntity.cases.interpreted-table.title', {
                  count: data?.count_interpretations,
                })}
              </TabsListItem>
              <TabsListItem value={Tabs.OtherCases}>
                {t('variantEntity.cases.other-table.title', {
                  count: data?.count_uninterpreted_cases,
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
  );
}

export default CasesTab;
