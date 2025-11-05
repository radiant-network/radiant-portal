import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { PaginationState } from '@tanstack/table-core';
import useSWR from 'swr';

import { ApiError, ListBodyWithCriteria, SearchCriterion, VariantUninterpretedCasesSearchResponse } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import CasePreviewSheet from '@/components/feature/preview/case-preview-sheet';
import { usePreviewCaseNavigation } from '@/components/feature/preview/use-preview-case-navigation';
import { useI18n } from '@/components/hooks/i18n';
import { variantsApi } from '@/utils/api';

import { SELECTED_CASE_PARAM } from './constants';
import { getOtherCasesColumns, otherCasesDefaultSettings } from './table-settings';
import OtherCasesFilters, { UninterpretedCasesFiltersState } from './uninterpreted-cases-filters';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});

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
        field: 'diagnosis_lab_code',
        value: [initialFilters.institution],
        operator: 'contains',
      });
    }

    if (initialFilters.test && initialFilters.test !== 'all') {
      criteria.push({
        field: 'analysis_catalog_code',
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
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        page_index: pagination.pageIndex,
      },
    },
    fetchUninterpretedCases,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const casesData = useMemo(() => data?.list || [], [data?.list]);

  const { selectedCase, hasPrevious, hasNext, handleClosePreview, handlePreviousCase, handleNextCase } =
    usePreviewCaseNavigation({
      casesData,
      searchParams,
      setSearchParams,
      selectedCaseParamKey: SELECTED_CASE_PARAM,
      setRowSelection,
    });

  return (
    <div className="space-y-6 mt-2">
      <OtherCasesFilters filters={initialFilters} onFiltersChange={setInitialFilters} />
      <DataTable
        id="uninterpreted-cases"
        columns={getOtherCasesColumns(t)}
        data={casesData}
        defaultColumnSettings={otherCasesDefaultSettings}
        defaultServerSorting={[]}
        loadingStates={{
          total: isLoading,
          list: isLoading,
        }}
        total={data?.count || 0}
        pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
        onServerSortingChange={() => {}}
        tableIndexResultPosition="bottom"
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
      <CasePreviewSheet
        open={!!selectedCase}
        setOpen={() => handleClosePreview()}
        case={selectedCase!}
        onPrevious={handlePreviousCase}
        onNext={handleNextCase}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
    </div>
  );
}

export default UninterpretedCasesTable;
