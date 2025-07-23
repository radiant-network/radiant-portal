import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { useMemo, useState } from 'react';
import { getInterpretedCasesColumns, interpretedCasesDefaultSettings } from './table-settings';
import { PaginationState } from '@tanstack/table-core';
import InterpretedCasesExpand from './interpreted-cases-expand';
import InterpretedCasesFilters, { InterpretedCasesFiltersState } from './interpreted-cases-filters';
import { useParams } from 'react-router';
import { ApiError, ListBodyWithCriteria, SearchCriterion, VariantInterpretedCasesSearchResponse } from '@/api/api';
import { variantsApi } from '@/utils/api';
import useSWR from 'swr';

type InterpretedCasesSearchInput = {
  key: string;
  locusId: string;
  criteria: ListBodyWithCriteria;
};

async function fetchInterpretedCases(input: InterpretedCasesSearchInput) {
  const response = await variantsApi.getGermlineVariantInterpretedCases(input.locusId, input.criteria);
  return response.data;
}

function InterpretedCasesTable() {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [initialFilters, setInitialFilters] = useState<InterpretedCasesFiltersState>({
    mondo: '',
    institution: 'all',
    test: 'all',
    classification: 'all',
  });

  const searchCriteria: SearchCriterion[] = useMemo(() => {
    const criteria: SearchCriterion[] = [];

    if (initialFilters.mondo) {
      criteria.push({
        field: 'condition_term',
        value: [initialFilters.mondo],
        operator: 'contains',
      });
    }

    if (initialFilters.institution && initialFilters.institution !== 'all') {
      criteria.push({
        field: 'performer_lab_code',
        value: [initialFilters.institution],
      });
    }

    if (initialFilters.test && initialFilters.test !== 'all') {
      criteria.push({
        field: 'case_analysis_code',
        value: [initialFilters.test],
      });
    }

    if (initialFilters.classification && initialFilters.classification !== 'all') {
      criteria.push({
        field: 'classification',
        value: [initialFilters.classification],
      });
    }

    return criteria;
  }, [initialFilters.mondo, initialFilters.institution, initialFilters.test, initialFilters.classification]);

  const { data, isLoading } = useSWR<VariantInterpretedCasesSearchResponse, ApiError, InterpretedCasesSearchInput>(
    {
      key: 'interpreted-cases',
      locusId: params.locusId!,
      criteria: {
        search_criteria: searchCriteria,
        sort: [
          {
            field: 'updated_on',
            order: 'desc',
          },
        ],
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        page_index: pagination.pageIndex,
      },
    },
    fetchInterpretedCases,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  return (
    <div className="space-y-6 mt-2">
      <InterpretedCasesFilters filters={initialFilters} onFiltersChange={setInitialFilters} />
      <DataTable
        id="interpreted-cases"
        columns={getInterpretedCasesColumns(t)}
        data={data?.list || []}
        defaultColumnSettings={interpretedCasesDefaultSettings}
        defaultServerSorting={[]}
        loadingStates={{
          total: isLoading,
          list: isLoading,
        }}
        total={data?.count || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        onServerSortingChange={() => {}}
        subComponent={data => <InterpretedCasesExpand locusId={params.locusId!} data={data} />}
        tableIndexResultPosition="bottom"
      />
    </div>
  );
}

export default InterpretedCasesTable;
