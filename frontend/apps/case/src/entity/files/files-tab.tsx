import { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';

import {
  ApiError,
  DocumentsSearchResponse,
  ListBodyWithCriteria,
  SearchCriterion,
  SortBody,
  SortBodyOrderEnum,
} from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';
import { caseApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

import { defaultSettings, getCaseEntityDocumentsColumns } from './files-table/files-tab-table-settings';
import FilesTableFilters from './files-table/files-table-filters';

const DEFAULT_SORTING = [
  {
    field: 'document_id',
    order: SortBodyOrderEnum.Desc,
  },
  {
    field: 'relationship_to_proband_code',
    order: SortBodyOrderEnum.Desc,
  },
];

const ADDITIONAL_FIELDS = ['seq_id', 'hash', 'run_alias'];

type DocumentInput = {
  caseId: number;
  body: ListBodyWithCriteria;
};

async function fetchDocuments(input: DocumentInput) {
  const response = await caseApi.caseEntityDocumentsSearch(input.caseId, input.body);
  return response.data;
}

function FilesTab() {
  const { t } = useI18n();
  const caseId = useCaseIdFromParam();
  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([]);
  const [sorting, setSorting] = useState<SortBody[]>(DEFAULT_SORTING);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [additionalFields, setAdditionalFields] = useState<string[]>(ADDITIONAL_FIELDS);

  const { data, error, isLoading } = useSWR<DocumentsSearchResponse, ApiError, DocumentInput>(
    {
      caseId,
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
    <Card>
      <CardContent>
        <div className="pt-4">
          <DataTable
            id="case-entity-files"
            columns={getCaseEntityDocumentsColumns(t)}
            TableFilters={
              <FilesTableFilters caseId={caseId} setSearchCriteria={setSearchCriteria} loading={isLoading} />
            }
            data={data?.list ?? []}
            defaultColumnSettings={defaultSettings}
            hasError={!!error}
            loadingStates={{
              total: isLoading,
              list: isLoading,
            }}
            pagination={{ type: 'server', state: pagination, onPaginationChange: setPagination }}
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
        </div>
      </CardContent>
    </Card>
  );
}

export default FilesTab;
