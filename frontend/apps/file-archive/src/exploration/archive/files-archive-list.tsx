import { useMemo, useState } from 'react';
import useSWR from 'swr';

import type { ApiError, DocumentsSearchResponse, ListBodyWithCriteria, SearchCriterion, SortBody } from '@/api/api';
import type { PaginationState } from '@/components/base/data-table/data-table';
import DataTable, { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { documentApi } from '@/utils/api';

import FilesTableFilters from './files-archive-list-table-filters';
import { defaultSettings, getFilesArchiveColumns } from './files-archive-table-settings';

type DocumentInput = {
  body: ListBodyWithCriteria;
};

const FILES_ARCHIVE_DEFAULT_SORTING: SortBody[] = [
  { field: 'document_id', order: 'desc' },
  { field: 'seq_id', order: 'desc' },
];

async function fetchDocuments(input: DocumentInput, tenant: string) {
  const response = await documentApi.searchDocuments(tenant, input.body);
  return response.data;
}

function FilesArchiveList() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([]);
  const [sorting, setSorting] = useState<SortBody[]>(FILES_ARCHIVE_DEFAULT_SORTING);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [additionalFields, setAdditionalFields] = useState<string[]>([]);

  const columns = useMemo(() => getFilesArchiveColumns(t), [t]);

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
    input => fetchDocuments(input, tenant),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  return (
    <DataTable
      id="files-archive-list"
      columns={columns}
      TableFilters={<FilesTableFilters setSearchCriteria={setSearchCriteria} />}
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
        defaultSorting: FILES_ARCHIVE_DEFAULT_SORTING,
        onSortingChange: setSorting,
      }}
    />
  );
}
export default FilesArchiveList;
