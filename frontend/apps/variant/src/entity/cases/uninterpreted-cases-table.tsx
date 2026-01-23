import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { PaginationState } from '@tanstack/table-core';
import useSWR from 'swr';

import { ApiError, ListBodyWithCriteria, SearchCriterion, VariantUninterpretedCasesSearchResponse } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import SliderUninterpretedCaseSheet from '@/entity/cases/slider/slider-uninterpreted-case-sheet';
import { useSliderCasePatientIdNavigation } from '@/entity/cases/slider/use-slider-case-navigation';
import { variantsApi } from '@/utils/api';

import UninterpretedCasesFilters, { UninterpretedCasesFiltersState } from './table/uninterpreted-cases-filters';
import {
  getUninterpretedCasesColumns,
  uninterpretedCasesDefaultSettings,
} from './table/uninterpreted-cases-table-settings';
import { SELECTED_UNINTERPRETED_CASE_PARAM } from './constants';

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
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [initialFilters, setInitialFilters] = useState<UninterpretedCasesFiltersState>({
    phenotype: '',
    institution: [],
    test: [],
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

    if (initialFilters.institution && initialFilters.institution.length > 0) {
      criteria.push({
        field: 'diagnosis_lab_code',
        value: [...initialFilters.institution],
      });
    }

    if (initialFilters.test && initialFilters.test.length > 0) {
      criteria.push({
        field: 'analysis_catalog_code',
        value: [...initialFilters.test],
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
    useSliderCasePatientIdNavigation({
      casesData,
      searchParams,
      setSearchParams,
      selectedCaseParamKey: SELECTED_UNINTERPRETED_CASE_PARAM,
      setRowSelection,
    });

  return (
    <div className="space-y-6 mt-2">
      <DataTable
        id="uninterpreted-cases"
        columns={getUninterpretedCasesColumns(t)}
        TableFilters={<UninterpretedCasesFilters filters={initialFilters} onFiltersChange={setInitialFilters} />}
        data={casesData}
        defaultColumnSettings={uninterpretedCasesDefaultSettings}
        loadingStates={{
          total: isLoading,
          list: isLoading,
        }}
        total={data?.count || 0}
        pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
        tableIndexResultPosition="bottom"
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        serverOptions={{
          onSortingChange: () => [],
        }}
      />
      <SliderUninterpretedCaseSheet
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
