import { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';

import { Count, CountBodyWithSqon, GermlineSNVOccurrence, SortBody, Sqon } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { FetchOccurrencesListContext } from '@/components/base/occurrence/hooks/use-occurrences-list';
import QueryBuilder from '@/components/base/query-builder-v3/query-builder';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useConfig } from '@/components/cores/applications-config';
import { AggregationConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { occurrencesApi } from '@/utils/api';

export function getVisibleAggregations(aggregationGroups: AggregationConfig) {
  return Object.fromEntries(
    Object.entries(aggregationGroups)
      .map(([key, group]) => {
        const filteredGroup = {
          ...group,
          items: group.items.filter(item => item.facetHidden !== true),
        };
        return [key, filteredGroup];
      })
      .filter(([_, group]) => (group as any).items.length > 0), // Remove groups with no visible items
  ) as AggregationConfig;
}

import { defaultSNVSettings, getSNVOccurrenceColumns } from './table-settings';

type SnvOccurrenceListInput = {
  caseId: number;
  seqId: number;
  listBody: {
    additional_fields?: string[];
    limit: number;
    page_index: number;
    sort: SortBody[];
    sqon: Sqon;
  };
};

type SnvOccurrenceLCountInput = {
  caseId: number;
  seqId: number;
  countBody: CountBodyWithSqon;
};

// async function fetchQueryCount(input: SnvOccurrenceLCountInput) {
//   const response = await occurrencesApi.countGermlineSNVOccurrences(input.caseId, input.seqId, input.countBody);
//   return response.data;
// }

function QueryBuilderV3() {
  const seqId = 1;
  const caseId = 1;
  const { t } = useI18n();
  const config = useConfig();
  const [rowSelection, setRowSelection] = useState({});
  const [additionalFields, setAdditionalFields] = useState<string[]>([]);

  const activeSqon = {
    op: 'and',
    content: [],
  };
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Variant count Request
  const [sorting, setSorting] = useState<SortBody[]>([]);

  const appId = config.snv_occurrence.app_id;

  // Variant list request
  const fetchOccurrencesList = useSWR<GermlineSNVOccurrence[]>(
    {
      caseId,
      seqId,
      listBody: {
        additional_fields: additionalFields,
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
        sort: sorting,
        sqon: activeSqon,
      },
    },
    async (params: SnvOccurrenceListInput) =>
      seqId
        ? occurrencesApi.listGermlineSNVOccurrences(caseId, seqId, params.listBody).then(response => response.data)
        : [],
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

  const fetchOccurrencesCount = useSWR<Count>(
    {
      caseId,
      seqId,
      countBody: { sqon: activeSqon },
    },
    async (params: SnvOccurrenceLCountInput) =>
      seqId
        ? occurrencesApi.countGermlineSNVOccurrences(caseId, seqId, params.countBody).then(response => response.data)
        : { count: 0 },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

  return (
    <QueryBuilder appId={config.snv_occurrence.app_id}>
      <FetchOccurrencesListContext
        value={{
          mutate: fetchOccurrencesList.mutate,
          loading: fetchOccurrencesList.isLoading,
        }}
      >
        <Card>
          <CardContent>
            <DataTable
              id={appId}
              columns={getSNVOccurrenceColumns(t)}
              data={fetchOccurrencesList.data ?? []}
              defaultColumnSettings={defaultSNVSettings}
              loadingStates={{
                total: fetchOccurrencesCount.isLoading,
                list: fetchOccurrencesList.isLoading,
              }}
              pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
              serverOptions={{
                setAdditionalFields,
                onSortingChange: setSorting,
              }}
              total={fetchOccurrencesCount.data?.count ?? 0}
              enableColumnOrdering
              enableFullscreen
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
            />
          </CardContent>
        </Card>
      </FetchOccurrencesListContext>
    </QueryBuilder>
  );
}
export default QueryBuilderV3;
