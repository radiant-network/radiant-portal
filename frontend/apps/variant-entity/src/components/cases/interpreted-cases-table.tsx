import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { useState } from 'react';
import { getInterpretedCasesColumns, interpretedCasesDefaultSettings } from './table-settings';
import { PaginationState } from '@tanstack/table-core';
import InterpretedCasesExpand from './interpreted-cases-expand';
import InterpretedCasesFilters, { InterpretedCasesFiltersState } from './interpreted-cases-filters';
import { useParams } from 'react-router';
import { ApiError, ListBodyWithCriteria, VariantInterpretedCasesSearchResponse } from '@/api/api';
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
    institution: '', // todo
    test: '', // todo
    classification: '', // todo
  });

  const { data, isLoading } = useSWR<VariantInterpretedCasesSearchResponse, ApiError, InterpretedCasesSearchInput>(
    {
      key: 'interpreted-cases',
      locusId: params.locusId!,
      criteria: {},
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
