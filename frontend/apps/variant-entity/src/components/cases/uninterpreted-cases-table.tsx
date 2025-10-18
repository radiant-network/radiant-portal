import { PaginationState } from '@tanstack/table-core';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import useSWR from 'swr';

import { ApiError, ListBodyWithCriteria, SearchCriterion, VariantUninterpretedCasesSearchResponse } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { variantsApi } from '@/utils/api';

import CasePreviewSheet from '@/components/feature/preview/case-preview-sheet';
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
  const selectedCaseId = searchParams.get(SELECTED_CASE_PARAM);
  const selectedCase = casesData.find(caseItem => caseItem.case_id.toString() === selectedCaseId);

  const selectedCaseIndex = selectedCaseId
    ? casesData.findIndex(caseItem => caseItem.case_id.toString() === selectedCaseId)
    : -1;

  const handleClosePreview = () => {
    setSearchParams(prev => {
      prev.delete(SELECTED_CASE_PARAM);
      return prev;
    });
  };

  const handlePreviousCase = () => {
    if (selectedCaseIndex > 0 && selectedCase) {
      const currentCaseId = selectedCase.case_id;
      // Find the first previous case with a different case_id
      for (let i = selectedCaseIndex - 1; i >= 0; i--) {
        if (casesData[i].case_id !== currentCaseId) {
          setSearchParams(prev => {
            prev.set(SELECTED_CASE_PARAM, casesData[i].case_id.toString());
            return prev;
          });
          return;
        }
      }
    }
  };

  const handleNextCase = () => {
    if (selectedCaseIndex >= 0 && selectedCaseIndex < casesData.length - 1 && selectedCase) {
      const currentCaseId = selectedCase.case_id;
      // Find the first next case with a different case_id
      for (let i = selectedCaseIndex + 1; i < casesData.length; i++) {
        if (casesData[i].case_id !== currentCaseId) {
          setSearchParams(prev => {
            prev.set(SELECTED_CASE_PARAM, casesData[i].case_id.toString());
            return prev;
          });
          return;
        }
      }
    }
  };

  // Check if there's a previous case with a different case_id
  const hasPrevious = useMemo(() => {
    if (selectedCaseIndex <= 0 || !selectedCase) return false;
    const currentCaseId = selectedCase.case_id;
    for (let i = selectedCaseIndex - 1; i >= 0; i--) {
      if (casesData[i].case_id !== currentCaseId) {
        return true;
      }
    }
    return false;
  }, [selectedCaseIndex, selectedCase, casesData]);

  // Check if there's a next case with a different case_id
  const hasNext = useMemo(() => {
    if (selectedCaseIndex < 0 || selectedCaseIndex >= casesData.length - 1 || !selectedCase) return false;
    const currentCaseId = selectedCase.case_id;
    for (let i = selectedCaseIndex + 1; i < casesData.length; i++) {
      if (casesData[i].case_id !== currentCaseId) {
        return true;
      }
    }
    return false;
  }, [selectedCaseIndex, selectedCase, casesData]);

  useEffect(() => {
    if (selectedCaseId && casesData.length > 0) {
      const rowIndex = casesData.findIndex(caseItem => caseItem.case_id.toString() === selectedCaseId);
      if (rowIndex !== -1) {
        setRowSelection({ [rowIndex]: true });
      } else {
        setRowSelection({});
      }
    } else {
      setRowSelection({});
    }
  }, [selectedCaseId, casesData]);

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
        pagination={pagination}
        onPaginationChange={setPagination}
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
