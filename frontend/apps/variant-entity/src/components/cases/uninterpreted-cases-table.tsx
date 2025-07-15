import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { useMemo, useState } from 'react';
import { getOtherCasesColumns, otherCasesDefaultSettings } from './table-settings';
import { PaginationState } from '@tanstack/table-core';
import OtherCasesFilters, { UninterpretedCasesFiltersState } from './uninterpreted-cases-filters';
import { ApiError, ListBodyWithCriteria, SearchCriterion, VariantUninterpretedCasesSearchResponse } from '@/api/api';
import { variantsApi } from '@/utils/api';
import useSWR from 'swr';
import { useParams } from 'react-router';

type UninterpretedCasesSearchInput = {
  key: string;
  locusId: string;
  criteria: ListBodyWithCriteria;
};

async function fetchUninterpretedCases(input: UninterpretedCasesSearchInput) {
  const response = await variantsApi.getGermlineVariantUninterpretedCases(input.locusId, input.criteria);
  return response.data;
}

function UninterpretedCasesTable() {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [initialFilters, setInitialFilters] = useState<UninterpretedCasesFiltersState>({
    phenotype: '',
    institution: 'all',
    test: 'all',
  });

  const searchCriteria: SearchCriterion[] = useMemo(() => {
    const criteria: SearchCriterion[] = [];

    if (initialFilters.phenotype) {
      criteria.push({
        field: 'phenotypes_term',
        value: [initialFilters.phenotype],
        operator: 'contains',
      });
    }

    if (initialFilters.institution && initialFilters.institution !== 'all') {
      criteria.push({
        field: 'performer_lab_code',
        value: [initialFilters.institution],
        operator: 'contains',
      });
    }

    if (initialFilters.test && initialFilters.test !== 'all') {
      criteria.push({
        field: 'case_analysis_code',
        value: [initialFilters.test],
        operator: 'contains',
      });
    }

    return criteria;
  }, [initialFilters.phenotype, initialFilters.institution, initialFilters.test]);

  const { data, isLoading } = useSWR<VariantUninterpretedCasesSearchResponse, ApiError, UninterpretedCasesSearchInput>(
    {
      key: 'uninterpreted-cases',
      locusId: params.locusId!,
      criteria: {
        search_criteria: searchCriteria,
        sort: [
          {
            field: 'updated_on',
            order: 'desc',
          },
        ],
      },
    },
    fetchUninterpretedCases,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  return (
    <div className="space-y-6 mt-2">
      <OtherCasesFilters filters={initialFilters} onFiltersChange={setInitialFilters} />
      <DataTable
        id="uninterpreted-cases"
        columns={getOtherCasesColumns(t)}
        data={data?.list || []}
        defaultColumnSettings={otherCasesDefaultSettings}
        defaultServerSorting={[]}
        loadingStates={{
          total: isLoading,
          list: isLoading,
        }}
        total={data?.count || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        onServerSortingChange={() => {}}
        tableIndexResultPosition="bottom"
      />
    </div>
  );
}

export default UninterpretedCasesTable;
