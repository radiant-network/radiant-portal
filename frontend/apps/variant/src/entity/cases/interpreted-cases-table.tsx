import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { PaginationState } from '@tanstack/table-core';
import useSWR from 'swr';

import { ApiError, ListBodyWithCriteria, SearchCriterion, VariantInterpretedCasesSearchResponse } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { variantsApi } from '@/utils/api';

import SliderInterpretedCaseSheet from './slider/slider-interpreted-case-sheet';
import { useSliderCasePatientIdNavigation } from './slider/use-slider-case-navigation';
import InterpretedCasesFilters, { InterpretedCasesFiltersState } from './table/interpreted-cases-filters';
import { getInterpretedCasesColumns, interpretedCasesDefaultSettings } from './table/interpreted-cases-table-settings';
import { SELECTED_INTERPRETED_CASE_PARAM } from './constants';
import InterpretedCasesExpand from './interpreted-cases-expand';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [initialFilters, setInitialFilters] = useState<InterpretedCasesFiltersState>({
    mondo: '',
    institution: [],
    test: [],
    classification: [],
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

    if (initialFilters.classification && initialFilters.classification.length > 0) {
      criteria.push({
        field: 'classification',
        value: [...initialFilters.classification],
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

  const casesData = useMemo(() => data?.list || [], [data?.list]);

  const { selectedCase, hasPrevious, hasNext, handleClosePreview, handlePreviousCase, handleNextCase } =
    useSliderCasePatientIdNavigation({
      casesData,
      searchParams,
      setSearchParams,
      selectedCaseParamKey: SELECTED_INTERPRETED_CASE_PARAM,
      setRowSelection,
    });

  return (
    <div className="space-y-6 mt-2">
      <DataTable
        id="interpreted-cases"
        columns={getInterpretedCasesColumns(t)}
        TableFilters={<InterpretedCasesFilters filters={initialFilters} onFiltersChange={setInitialFilters} />}
        data={casesData}
        defaultColumnSettings={interpretedCasesDefaultSettings}
        loadingStates={{
          total: isLoading,
          list: isLoading,
        }}
        total={data?.count || 0}
        pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
        subComponent={data => <InterpretedCasesExpand locusId={params.locusId!} data={data} />}
        tableIndexResultPosition="bottom"
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        serverOptions={{
          onSortingChange: () => {},
        }}
      />
      <SliderInterpretedCaseSheet
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

export default InterpretedCasesTable;
