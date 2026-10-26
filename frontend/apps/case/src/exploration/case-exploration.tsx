import { useMemo, useState } from 'react';
import useSWR from 'swr';

import type { CasesSearchResponse, ListBodyWithCriteria, SearchCriterion, SortBody } from '@/api/api';
import type { PaginationState } from '@/components/base/data-table/data-table';
import DataTable, { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { caseApi } from '@/utils/api';

import TableFilters from './table/case-exploration-table-filters';
import { defaultSettings, getCaseExplorationColumns } from './table/cases-exploration-table-settings';
import CaseGroupEmptyState from './case-group-empty-state';
import CaseGroupTag from './case-group-tag';
import useCaseGroup from './use-case-group';

type CaseListInput = {
  listBodyWithCriteria: ListBodyWithCriteria;
};

const CASES_DEFAULT_SORTING: SortBody[] = [{ field: 'updated_on', order: 'desc' }];

async function fetchCasesList(input: CaseListInput, tenant: string) {
  const response = await caseApi.searchCases(tenant, input.listBodyWithCriteria);
  return response.data;
}

export default function App() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const caseGroup = useCaseGroup();
  const [sorting, setSorting] = useState<SortBody[]>(CASES_DEFAULT_SORTING);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([]);

  const [additionalFields, setAdditionalFields] = useState<string[]>([]);

  const criteria = caseGroup.criterion ? [...searchCriteria, caseGroup.criterion] : searchCriteria;

  const { data, isLoading, isValidating, mutate } = useSWR<CasesSearchResponse, any, CaseListInput>(
    {
      listBodyWithCriteria: {
        additional_fields: additionalFields,
        search_criteria: criteria,
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
        sort: sorting,
      },
    },
    input => fetchCasesList(input, tenant),
    {
      revalidateOnFocus: false,
    },
  );

  const columns = useMemo(() => getCaseExplorationColumns(t, mutate), [t, mutate]);

  const showCaseGroupEmptyState = !!caseGroup.name && data?.count === 0 && searchCriteria.length === 0;

  return (
    <>
      <HeaderNavigation
        isLoading={false}
        title={t('case_exploration.case.title', { total: data?.count ?? 0 })}
        variant="info"
      />
      <main className={`bg-muted h-screen overflow-auto p-3`}>
        <Card className="h-auto size-max w-full ">
          <CardContent>
            <div className="bg-background pt-4">
              <DataTable
                id="case-exploration"
                columns={columns}
                TableFilters={
                  <TableFilters
                    loading={isLoading && !isValidating}
                    setSearchCriteria={setSearchCriteria}
                    extraFilters={
                      caseGroup.name ? (
                        <CaseGroupTag
                          name={caseGroup.name}
                          createdOn={caseGroup.createdOn}
                          loading={caseGroup.isLoading}
                          criterion={caseGroup.criterion}
                          onRemove={caseGroup.remove}
                        />
                      ) : undefined
                    }
                    onClear={caseGroup.remove}
                  />
                }
                data={data?.list ?? []}
                defaultColumnSettings={defaultSettings}
                emptyState={
                  showCaseGroupEmptyState ? <CaseGroupEmptyState onShowAllCases={caseGroup.remove} /> : undefined
                }
                loadingStates={{
                  total: isLoading,
                  list: isLoading,
                }}
                pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
                total={data?.count ?? 0}
                enableColumnOrdering
                enableFullscreen
                tableIndexResultPosition="bottom"
                serverOptions={{
                  setAdditionalFields,
                  defaultSorting: CASES_DEFAULT_SORTING,
                  onSortingChange: setSorting,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
