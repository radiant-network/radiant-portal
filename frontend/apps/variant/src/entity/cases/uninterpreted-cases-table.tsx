import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { PaginationState } from '@tanstack/table-core';
import useSWR from 'swr';

import {
  ApiError,
  ListBodyWithCriteria,
  SearchCriterion,
  SortBody,
  VariantUninterpretedCasesSearchResponse,
} from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import SliderUninterpretedCaseSheet from '@/entity/cases/slider/slider-uninterpreted-case-sheet';
import { useSliderCasePatientIdNavigation } from '@/entity/cases/slider/use-slider-case-navigation';
import { variantsApi } from '@/utils/api';

import UninterpretedCasesTableFilters from './table/uninterpreted-cases-table-filters';
import {
  getUninterpretedCasesColumns,
  uninterpretedCasesDefaultSettings,
} from './table/uninterpreted-cases-table-settings';
import { SELECTED_UNINTERPRETED_CASE_PARAM } from './constants';

type UninterpretedCasesSearchInput = {
  key: string;
  locusId: string;
  listBodyWithCriteria: ListBodyWithCriteria;
};

async function fetchUninterpretedCases(input: UninterpretedCasesSearchInput) {
  const response = await variantsApi.getGermlineVariantUninterpretedCases(input.locusId, input.listBodyWithCriteria);
  return response.data;
}

function UninterpretedCasesTable() {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortBody[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [additionalFields, setAdditionalFields] = useState<string[]>([]);

  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([]);

  const { data, isLoading, isValidating } = useSWR<
    VariantUninterpretedCasesSearchResponse,
    ApiError,
    UninterpretedCasesSearchInput
  >(
    {
      key: 'uninterpreted-cases',
      locusId: params.locusId!,
      listBodyWithCriteria: {
        additional_fields: additionalFields,
        search_criteria: searchCriteria,
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
        sort: sorting,
      },
    },
    fetchUninterpretedCases,
    {
      revalidateOnFocus: false,
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
        TableFilters={
          <UninterpretedCasesTableFilters loading={isLoading && !isValidating} setSearchCriteria={setSearchCriteria} />
        }
        data={casesData}
        defaultColumnSettings={uninterpretedCasesDefaultSettings}
        loadingStates={{
          total: isLoading,
          list: isLoading,
        }}
        pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
        total={data?.count || 0}
        enableColumnOrdering
        enableFullscreen
        tableIndexResultPosition="bottom"
        serverOptions={{
          setAdditionalFields,
          onSortingChange: setSorting,
        }}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
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
