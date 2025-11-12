import { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';

import { CasesSearchResponse, ListBodyWithCriteria, SearchCriterion, SortBody, SortBodyOrderEnum } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { defaultSettings, getCaseExplorationColumns } from '@/feature/case-table/table-settings';
import { caseApi } from '@/utils/api';

import TableFilters from '../table-filters/case-exploration-table-filters';

type CaseListInput = {
  listBodyWithCriteria: ListBodyWithCriteria;
};

const DEFAULT_SORTING = [
  {
    field: 'created_at',
    order: SortBodyOrderEnum.Asc,
  },
];

async function fetchCasesList(input: CaseListInput) {
  const response = await caseApi.searchCases(input.listBodyWithCriteria);
  return response.data;
}

function CasesTab() {
  const { t } = useI18n();
  const [sorting, setSorting] = useState<SortBody[]>(DEFAULT_SORTING);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([]);

  const allAdditionalFields = [
    'case_type',
    'organization_code',
    'organization_name',
    'diagnosis_lab_code',
    'diagnosis_lab_name',
    'prescriber',
    'primary_condition_id',
    'primary_condition_name',
  ];
  const [additionalFields, setAdditionalFields] = useState<string[]>(allAdditionalFields);

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
    <div className="bg-background pt-4">
      <DataTable
        id="case-exploration"
        columns={getCaseExplorationColumns(t)}
        TableFilters={<TableFilters loading={isLoading && !isValidating} setSearchCriteria={setSearchCriteria} />}
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
          defaultSorting: DEFAULT_SORTING,
          onSortingChange: setSorting,
        }}
      />
    </div>
  );
}

export default CasesTab;
