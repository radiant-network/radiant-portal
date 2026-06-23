import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import { ApiError, VariantCasesCount, VariantCasesFilters } from '@/api/api';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { CaseEntityCasesTabs } from '@/components/cores/types/case-tabs';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { tabContentClassName } from '@/style';
import { variantsApi } from '@/utils/api';

import { CasesFiltersProvider } from './table/filters/cases-filters-context';
import InterpretedCasesTable from './interpreted-cases-table';
import UninterpretedCasesTable from './uninterpreted-cases-table';

const TAB_SEARCH_PARAM = 'cases';

type CasesCountInput = {
  key: string;
  locusId: string;
};

async function fetchCasesCount(input: CasesCountInput, tenant: string) {
  const response = await variantsApi.getGermlineVariantCasesCount(tenant, input.locusId);
  return response.data;
}

async function fetchCasesFilters(tenant: string) {
  const response = await variantsApi.getGermlineVariantCasesFilters(tenant);
  return response.data;
}

function CasesTab() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const params = useParams<{ locusId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<CaseEntityCasesTabs>(
    (searchParams.get(TAB_SEARCH_PARAM) as CaseEntityCasesTabs) ?? CaseEntityCasesTabs.InterpretedCases,
  );

  const { data } = useSWR<VariantCasesCount, ApiError, CasesCountInput>(
    {
      key: 'cases-count',
      locusId: params.locusId!,
    },
    input => fetchCasesCount(input, tenant),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const filtersQuery = useSWR<VariantCasesFilters, ApiError, string>('cases-filters', () => fetchCasesFilters(tenant));

  const handleOnTabChange = useCallback(
    (value: CaseEntityCasesTabs) => {
      searchParams.set('cases', value);
      setSearchParams(searchParams, { replace: true });
      setActiveTab(value);
    },
    [searchParams],
  );

  useEffect(() => {
    setActiveTab((searchParams.get(TAB_SEARCH_PARAM) as CaseEntityCasesTabs) ?? CaseEntityCasesTabs.InterpretedCases);
  }, [searchParams]);

  return (
    <div className={tabContentClassName}>
      <CasesFiltersProvider filters={filtersQuery.data} isLoading={filtersQuery.isLoading}>
        <Card>
          <CardHeader size="sm" className="gap-1">
            <CardTitle className="text-xl">
              {t('variant_entity.cases.title', {
                count: data ? data.count_interpreted + data.count_uninterpreted : 0,
              })}
            </CardTitle>
            <CardDescription className="font-normal">{t('variant_entity.cases.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
              <TabsList>
                <TabsListItem data-cy="interpreted-tab" value={CaseEntityCasesTabs.InterpretedCases}>
                  {t('variant_entity.cases.interpreted_table.title', {
                    count: data?.count_interpreted,
                  })}
                </TabsListItem>
                <TabsListItem data-cy="uninterpreted-tab" value={CaseEntityCasesTabs.OtherCases}>
                  {t('variant_entity.cases.other_table.title', {
                    count: data?.count_uninterpreted,
                  })}
                </TabsListItem>
              </TabsList>
              <TabsContent value={CaseEntityCasesTabs.InterpretedCases}>
                <InterpretedCasesTable />
              </TabsContent>
              <TabsContent value={CaseEntityCasesTabs.OtherCases}>
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
