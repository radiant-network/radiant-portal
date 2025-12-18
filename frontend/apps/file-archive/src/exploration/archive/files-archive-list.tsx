import { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';

import { ApiError, DocumentsSearchResponse, ListBodyWithCriteria, SearchCriterion, SortBody } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { documentApi } from '@/utils/api';

import FilesTableFilters from './files-archive-list-table-filters';
import { defaultSettings, getFilesArchiveColumns } from './files-archive-table-settings';

const DEFAULT_SORTING: SortBody[] = [];

type DocumentInput = {
  body: ListBodyWithCriteria;
};

async function fetchDocuments(input: DocumentInput) {
  const response = await documentApi.searchDocuments(input.body);
  return response.data;
}

function FilesArchiveList() {
  const { t } = useI18n();
  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([]);
  const [sorting, setSorting] = useState<SortBody[]>(DEFAULT_SORTING);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [additionalFields, setAdditionalFields] = useState<string[]>([]);

  const { data, error, isLoading } = useSWR<DocumentsSearchResponse, ApiError, DocumentInput>(
    {
      body: {
        additional_fields: additionalFields,
        sort: sorting,
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
        search_criteria: searchCriteria,
      },
    },
    fetchDocuments,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  return (
    <DataTable
      id="files-archive-list"
      columns={getFilesArchiveColumns(t)}
      TableFilters={<FilesTableFilters setSearchCriteria={setSearchCriteria} loading={isLoading} />}
      data={data?.list ?? []}
      defaultColumnSettings={defaultSettings}
      hasError={!!error}
      loadingStates={{
        total: isLoading,
        list: isLoading,
      }}
      pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
      total={data?.count ?? 0}
      enableColumnOrdering
      enableFullscreen
      tableIndexResultPosition="bottom"
      serverOptions={{
        setAdditionalFields,
        defaultSorting: DEFAULT_SORTING,
        onSortingChange: setSorting,
      }}
    />
  );
}
export default FilesArchiveList;
