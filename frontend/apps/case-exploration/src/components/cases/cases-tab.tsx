import useSWR from 'swr';
import DataTable from '@/components/base/data-table/data-table';
import { PaginationState } from '@tanstack/react-table';
import { getCaseExplorationColumns, defaultSettings } from '@/feature/case-table/table-settings';
import { CasesSearchResponse, ListBodyWithCriteria, SearchCriterion, SortBody, SortBodyOrderEnum } from '@/api/api';
import { useState } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import { caseApi } from '@/utils/api';
import TableFilters  from '../table-filters/table-filters';

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

  const { data, isLoading, isValidating } = useSWR<CasesSearchResponse, any, CaseListInput>(
    {
      listBodyWithCriteria: {
        additional_fields: [
          'case_analysis_code',
          'case_analysis_name',
          'case_type',
          'case_id',
          'created_on',
          'managing_organization_code',
          'managing_organization_name',
          'mrn',
          'patient_id',
          'performer_lab_code',
          'performer_lab_name',
          'prescriber',
          'primary_condition_id',
          'primary_condition_name',
          'priority_code',
          'project_code',
          'request_id',
          'requested_by_code',
          'requested_by_name',
          'status_code',
          'updated_on',
        ],
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
        TableFilters={() => (
          <TableFilters
            loading={isLoading && !isValidating}
            setSearchCriteria={setSearchCriteria}
          />
        )}
        data={data?.list ?? []}
        defaultColumnSettings={defaultSettings}
        defaultServerSorting={DEFAULT_SORTING}
        loadingStates={{
          total: isLoading,
          list: isLoading,
        }}
        pagination={pagination}
        onPaginationChange={setPagination}
        onServerSortingChange={setSorting}
        total={data?.count ?? 0}
        enableColumnOrdering
        enableFullscreen
        tableIndexResultPosition="bottom"
      />
    </div>
  );
}

export default CasesTab;
