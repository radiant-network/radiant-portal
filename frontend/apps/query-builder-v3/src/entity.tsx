import { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { X } from 'lucide-react';
import useSWR from 'swr';

import { Count, CountBodyWithSqon, GermlineSNVOccurrence, SortBody, Sqon } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { FetchOccurrencesListContext } from '@/components/base/occurrence/hooks/use-occurrences-list';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { SidebarProvider } from '@/components/base/shadcn/sidebar';
import { useConfig } from '@/components/cores/applications-config';
import { AggregationConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';
import { occurrencesApi } from '@/utils/api';
import QueryBuilder from 'components/base/query-builder-v3/query-builder';
import { FilterList } from 'components/base/query-filters/filter-list';
import { SidebarGroups } from 'components/base/query-filters/sidebar-groups';
import { AggregateContext } from 'components/base/query-filters/use-aggregation-builder';

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
  const [open, setOpen] = useState(false);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string | null>(null);

  const appId = config.snv_occurrence.app_id;
  const aggregations = config.snv_occurrence.aggregations;
  const visibleAggregations = getVisibleAggregations(aggregations);

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
    <div className="bg-muted w-full">
      <div className="flex flex-1 h-screen overflow-hidden">
        <aside className="w-auto min-w-fit h-full shrink-0">
          <AggregateContext value={{ seqId, caseId }}>
            <SidebarProvider open={open} onOpenChange={setOpen} className="h-full flex flex-row">
              <div className="z-10">
                <SidebarGroups
                  aggregationGroups={visibleAggregations}
                  selectedItemId={selectedSidebarItem}
                  onItemSelect={setSelectedSidebarItem}
                />
              </div>
              <div
                className={cn('overflow-auto mb-16 border-r transition-[width] duration-300 ease-in-out', {
                  'w-[280px] p-4 opacity-100 relative': selectedSidebarItem,
                  'w-0 opacity-0': !selectedSidebarItem,
                })}
              >
                <div className="whitespace-nowrap">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setSelectedSidebarItem(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <FilterList appId={appId} aggregations={visibleAggregations} groupKey={selectedSidebarItem} />
                </div>
              </div>
            </SidebarProvider>
          </AggregateContext>
        </aside>
        <main className="flex-1 flex-shrink-1 px-3 pb-3 overflow-auto">
          <div className="py-3 space-y-2">
            <QueryBuilder />
          </div>
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
        </main>
      </div>
    </div>
  );
}
export default QueryBuilderV3;
