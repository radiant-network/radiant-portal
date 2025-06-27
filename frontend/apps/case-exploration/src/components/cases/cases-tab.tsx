import useSWR from 'swr';
import DataTable from '@/components/base/data-table/data-table';
import { PaginationState } from '@tanstack/react-table';
import { getCaseExplorationColumns, defaultSettings } from '@/feature/case-table/table-settings';
import { CaseResult, Count, CountBodyWithCriteria, ListBodyWithCriteria, SortBody, SortBodyOrderEnum } from '@/api/api';
import { useEffect, useState } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import { caseApi } from '@/utils/api';
import TableFilters from '../table-filters/table-filters';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';

type CaseListInput = {
  listBody: ListBodyWithCriteria;
};

type CaseCountInput = {
  countBody: CountBodyWithCriteria;
};

const DEFAULT_SORTING = [
  {
    field: 'created_at',
    order: SortBodyOrderEnum.Asc,
  },
];

async function fetchCasesList(input: CaseListInput) {
  const response = await caseApi.listCases(input.listBody);
  return response.data;
}

async function fetchCasesCount(input: CaseCountInput) {
  const response = await caseApi.countCases(input.countBody);
  return response.data;
}

type SearchCriterion = { field: string; value: string[] };

function CasesTab() {
  const { t } = useI18n();
  const [sorting, setSorting] = useState<SortBody[]>(DEFAULT_SORTING);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = usePersistedFilters<StringArrayRecord>(
    'case-exploration-filters',
    {
      priority: [],
      status: [],
      caseAnalysis: [],
      project: [],
      performerLab: [],
      requestedBy: [],
    }
  );
  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([]);
  
  // Build search_criteria array
  useEffect(() => {
    console.log('>>> useEffect in cases-tab: ', filters)
    let search_criteria: SearchCriterion[] = [];

    if (filters.priority.length > 0) {
      search_criteria.push({ field: 'priority_code', value: filters.priority });
    }
    if (filters.status.length > 0) {
      search_criteria.push({ field: 'status_code', value: filters.status });
    }
    if (filters.caseAnalysis.length > 0) {
      search_criteria.push({ field: 'case_analysis_code', value: filters.caseAnalysis });
    }
    if (filters.project.length > 0) {
      search_criteria.push({ field: 'project_code', value: filters.project });
    }
    if (filters.performerLab.length > 0) {
      search_criteria.push({ field: 'performer_lab_code', value: filters.performerLab });
    }
    if (filters.requestedBy.length > 0) {
      search_criteria.push({ field: 'requested_by_code', value: filters.requestedBy });
    }
    setSearchCriteria(search_criteria);

  }, [filters]);
  
  const { data: total, isLoading: totalIsLoading } = useSWR<Count, any, CaseCountInput>(
    {
      countBody: { search_criteria: searchCriteria },
    },
    fetchCasesCount,
    {
      revalidateOnFocus: false,
    },
  );

  const { data: list, isLoading: listIsLoading } = useSWR<CaseResult[], any, CaseListInput>(
    {
      listBody: {
        additional_fields: [
          'case_analysis_code',
          'created_at',
          'case_analysis_name',
          'case_analysis_type_code',
          'case_id',
          'created_on',
          'managing_organization_code',
          'managing_organization_name',
          'mrn',
          'patient_id',
          'performer_lab_code',
          'performer_lab_name',
          'prescriber',
          'primary_condition',
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
    <div className="bg-background">
      <DataTable
        id="case-exploration"
        columns={getCaseExplorationColumns(t)}
        TableFilters={() => (
          <TableFilters
            loading={listIsLoading}
            filters={filters}
            setFilters={setFilters}
            searchCriteria={searchCriteria}
          />
        )}
        data={list ?? []}
        defaultColumnSettings={defaultSettings}
        defaultServerSorting={DEFAULT_SORTING}
        loadingStates={{
          total: totalIsLoading,
          list: listIsLoading,
        }}
        pagination={pagination}
        onPaginationChange={setPagination}
        onServerSortingChange={setSorting}
        total={total?.count ?? 0}
        enableColumnOrdering
        enableFullscreen
        tableIndexResultPosition="bottom"
      />
    </div>
  );
}

export default CasesTab;
