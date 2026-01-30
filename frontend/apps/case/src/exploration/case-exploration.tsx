import { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';

import { CasesSearchResponse, ListBodyWithCriteria, SearchCriterion, SortBody } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import PageHeader from '@/components/base/page/page-header';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';
import { caseApi } from '@/utils/api';

import TableFilters from './table/case-exploration-table-filters';
import { defaultSettings, getCaseExplorationColumns } from './table/cases-exploration-table-settings';

type CaseListInput = {
  listBodyWithCriteria: ListBodyWithCriteria;
};

async function fetchCasesList(input: CaseListInput) {
  const response = await caseApi.searchCases(input.listBodyWithCriteria);
  return response.data;
}

export default function App() {
  const { t } = useI18n();
  const [sorting, setSorting] = useState<SortBody[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([]);

  const [additionalFields, setAdditionalFields] = useState<string[]>([]);

  const { data, isLoading, isValidating } = useSWR<CasesSearchResponse, any, CaseListInput>(
    {
      listBodyWithCriteria: {
        additional_fields: additionalFields,
        search_criteria: searchCriteria,
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
        sort: sorting,
      },
    },
    fetchCasesList,
    {
      revalidateOnFocus: false,
    },
  );
  return (
    <>
      <PageHeader
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
                columns={getCaseExplorationColumns(t)}
                TableFilters={
                  <TableFilters loading={isLoading && !isValidating} setSearchCriteria={setSearchCriteria} />
                }
                data={data?.list ?? []}
                defaultColumnSettings={defaultSettings}
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
