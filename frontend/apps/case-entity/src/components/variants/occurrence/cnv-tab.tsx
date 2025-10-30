import { PaginationState } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { Count, GermlineCNVOccurrence, SavedFilterType, SortBody, SortBodyOrderEnum, Sqon } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Card, CardContent } from '@/components/base/ui/card';
import { SidebarProvider } from '@/components/base/ui/sidebar';
import QueryBuilder from '@/components/feature/query-builder/query-builder';
import UserSavedFiltersProps, { getUserSavedFilters } from '@/components/feature/query-builder/user-saved-filters';
import { FilterComponent } from '@/components/feature/query-filters/filter-container';
import { FilterList } from '@/components/feature/query-filters/filter-list';
import { SidebarGroups } from '@/components/feature/query-filters/sidebar-groups';
import { AggregateContext } from '@/components/feature/query-filters/use-aggregation-builder';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';
import { useConfig } from '@/components/model/applications-config';
import { QueryBuilderState, resolveSyntheticSqon } from '@/components/model/query-builder-core';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { occurrencesApi } from '@/utils/api';

import { OccurrenceCountInput, useCNVOccurrencesCountHelper, useCNVOccurrencesListHelper } from '../hook';

import { defaultCNVSettings, getCNVOccurrenceColumns } from './table/cnv-occurrence-table-settings';

const DEFAULT_SORTING = [
  {
    field: 'name',
    order: SortBodyOrderEnum.Asc,
  },
];

async function fetchQueryCount(input: OccurrenceCountInput) {
  const response = await occurrencesApi.countGermlineCNVOccurrences(input.seqId, input.countBody);
  return response.data;
}

type CNVTabProps = {
  seqId: string;
};

function CNVTab({ seqId }: CNVTabProps) {
  const { t } = useI18n();
  const config = useConfig();
  const [isQBLoading, setQbLoading] = useState<boolean>(true);
  const [isQBInitialized, setQBInitialized] = useState<boolean>(false);

  const [qbState, setQbState] = useState<QueryBuilderState>();
  const [activeSqon, setActiveSqon] = useState<Sqon>({
    op: 'and',
    content: [],
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Variant count Request
  const [sorting, setSorting] = useState<SortBody[]>(DEFAULT_SORTING);
  const [open, setOpen] = useState(false);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string | null>(null);

  const appId = config.cnv_occurrence.app_id;
  const aggregations = config.cnv_occurrence.aggregations;

  function getAggregationFromConfig(key: string) {
    return Object.values(config.cnv_occurrence.aggregations)
      .flatMap(f => f.items)
      .find(f => f.key === key)!;
  }

  // Variant list request
  const { fetch: fetchOccurrencesListHelper } = useCNVOccurrencesListHelper({
    seqId,
    listBody: {
      additional_fields: ['calls', 'filter', 'quality', 'bc', 'pe'],
      limit: pagination.pageSize,
      page_index: pagination.pageIndex,
      sort: sorting,
      sqon: activeSqon,
    },
  });

  const { fetch: fetchOccurrencesCountHelper } = useCNVOccurrencesCountHelper({
    seqId,
    countBody: { sqon: activeSqon },
  });

  const fetchOccurrencesList = useSWR<GermlineCNVOccurrence[]>(
    'fetch-cnv-occurrences-list',
    fetchOccurrencesListHelper,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

  const fetchOccurrencesCount = useSWR<Count>('fetch-occurrences-cnv-count', fetchOccurrencesCountHelper, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    shouldRetryOnError: false,
  });

  /**
   * Restore activeSqon
   */
  useEffect(() => {
    if (isQBInitialized) return;

    getUserSavedFilters({
      savedFilterType: SavedFilterType.GERMLINE_CNV_OCCURRENCE,
    }).then(res => {
      const localQbState = queryBuilderRemote.getLocalQueryBuilderState(appId);

      setQbState({
        ...localQbState,
        savedFilters: res,
        selectedQueryIndexes: [0],
      });
      setActiveSqon(queryBuilderRemote.getResolvedActiveQuery(appId) as Sqon);
      setQBInitialized(true);
    });
  }, [isQBInitialized]);

  /**
   * Set QB loading to false only when both initialized and seqId is available
   */
  useEffect(() => {
    if (isQBInitialized && seqId) {
      setQbLoading(false);
    }
  }, [isQBInitialized, seqId]);

  /**
   * Re-fetch count
   */
  useEffect(() => {
    if (seqId === '') return;
    fetchOccurrencesCount.mutate();
  }, [seqId, activeSqon]);

  /**
   * Re-fetch list
   */
  useEffect(() => {
    if (seqId === '') return;
    fetchOccurrencesList.mutate();
  }, [seqId, sorting, pagination]);

  /**
   * Reset pagination on sqon change
   */
  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  }, [activeSqon]);

  return (
    <div className="bg-muted w-full">
      <div className="flex flex-1 h-screen overflow-hidden">
        <aside className="w-auto min-w-fit h-full shrink-0">
          <AggregateContext value={{ seqId }}>
            <SidebarProvider open={open} onOpenChange={setOpen} className="h-full flex flex-row">
              <div className="z-10">
                <SidebarGroups
                  aggregationGroups={aggregations}
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
                  <FilterList appId={appId} aggregations={aggregations} groupKey={selectedSidebarItem} />
                </div>
              </div>
            </SidebarProvider>
          </AggregateContext>
        </aside>
        <main className="flex-1 flex-shrink-1 px-3 pb-3 overflow-auto">
          <div className="py-3 space-y-2">
            <QueryBuilder
              id={appId}
              state={qbState}
              enableCombine
              enableFavorite
              enableShowHideLabels
              loading={isQBLoading}
              queryCountIcon={<VariantIcon size={14} />}
              fetchQueryCount={async resolvedSqon => {
                if (!seqId) {
                  return Promise.resolve(0);
                }

                return fetchQueryCount({
                  seqId,
                  countBody: {
                    sqon: resolvedSqon,
                  },
                }).then(res => res.count || 0);
              }}
              resolveSyntheticSqon={resolveSyntheticSqon}
              onActiveQueryChange={sqon => setActiveSqon(resolveSyntheticSqon(sqon, qbState?.queries || []) as Sqon)}
              onStateChange={state => {
                setQbState(state);
              }}
              queryPillFacetFilterConfig={{
                enable: true,
                blacklistedFacets: ['locus_id'],
                onFacetClick: filter => (
                  <FilterComponent field={getAggregationFromConfig(filter.content.field)} isOpen={true} />
                ),
              }}
              savedFilterType={SavedFilterType.GERMLINE_CNV_OCCURRENCE}
              dictionary={{
                queryPill: {
                  facet: (key: string) =>
                    t(`common.filters.labels.${getAggregationFromConfig(key).translation_key}`, {
                      defaultValue: key,
                    }),
                },
              }}
              {...UserSavedFiltersProps}
            />
          </div>
          <Card>
            <CardContent>
              <DataTable
                id="cnv-occurrence"
                columns={getCNVOccurrenceColumns(t)}
                data={fetchOccurrencesList.data ?? []}
                defaultColumnSettings={defaultCNVSettings}
                defaultServerSorting={DEFAULT_SORTING}
                loadingStates={{
                  total: fetchOccurrencesCount.isLoading,
                  list: fetchOccurrencesList.isLoading,
                }}
                pagination={pagination}
                onPaginationChange={setPagination}
                onServerSortingChange={setSorting}
                total={fetchOccurrencesCount.data?.count ?? 0}
                enableColumnOrdering
                enableFullscreen
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
export default CNVTab;
