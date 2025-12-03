import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { PaginationState } from '@tanstack/react-table';
import { X } from 'lucide-react';
import useSWR from 'swr';

import {
  Count,
  CountBodyWithSqon,
  GermlineCNVOccurrence,
  SavedFilterType,
  SortBody,
  SortBodyOrderEnum,
  Sqon,
} from '@/api/api';
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
import { ISyntheticSqon } from '@/components/model/sqon';
import { occurrencesApi } from '@/utils/api';

import { defaultCNVSettings, getCNVOccurrenceColumns } from './table/cnv-occurrence-table-settings';

const DEFAULT_SORTING = [
  {
    field: 'name',
    order: SortBodyOrderEnum.Asc,
  },
];

const ADDITIONAL_FIELDS = ['calls', 'filter', 'quality', 'bc', 'pe'];

async function fetchQueryCount(input: CnvOccurrenceCountInput) {
  const response = await occurrencesApi.countGermlineCNVOccurrences(input.caseId, input.seqId, input.countBody);
  return response.data;
}

type CnvOccurrenceListInput = {
  caseId: string;
  seqId: string;
  listBody: {
    additional_fields?: string[];
    limit: number;
    page_index: number;
    sort: SortBody[];
    sqon: Sqon;
  };
};

type CnvOccurrenceCountInput = {
  caseId: string;
  seqId: string;
  countBody: CountBodyWithSqon;
};

type CNVTabProps = {
  seqId: string;
};

function CNVTab({ seqId }: CNVTabProps) {
  const { t } = useI18n();
  const config = useConfig();
  const { caseId } = useParams<{ caseId: string }>();
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
  const [additionalFields, setAdditionalFields] = useState<string[]>(ADDITIONAL_FIELDS);

  const fetchOccurrencesList = useSWR<GermlineCNVOccurrence[]>(
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
    async (params: CnvOccurrenceListInput) =>
      seqId && caseId
        ? occurrencesApi.listGermlineCNVOccurrences(caseId, seqId, params.listBody).then(response => response.data)
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
    async (params: CnvOccurrenceCountInput) =>
      seqId && caseId
        ? occurrencesApi.countGermlineCNVOccurrences(caseId, seqId, params.countBody).then(response => response.data)
        : { count: 0 },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

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
   * Re-fetch list on initial load
   */
  useEffect(() => {
    if (!isQBInitialized) return;
    fetchOccurrencesList.mutate();
  }, [isQBInitialized]);

  /**
   * Re-fetch count
   */
  useEffect(() => {
    if (seqId === '' || caseId === '') return;
    fetchOccurrencesCount.mutate();
  }, [seqId, caseId, activeSqon]);

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
    seqId &&
    caseId && (
      <div className="bg-muted w-full">
        <div className="flex flex-1 h-screen overflow-hidden">
          <aside className="w-auto min-w-fit h-full shrink-0">
            <AggregateContext value={{ caseId, seqId }}>
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

                  if (!caseId) {
                    return Promise.resolve(0);
                  }

                  return fetchQueryCount({
                    caseId,
                    seqId,
                    countBody: {
                      sqon: resolvedSqon,
                    },
                  }).then(res => res.count || 0);
                }}
                resolveSyntheticSqon={resolveSyntheticSqon}
                onActiveQueryChange={sqon => {
                  const newActiveSqon = resolveSyntheticSqon(
                    sqon,
                    (qbState?.queries || []) as ISyntheticSqon[],
                  ) as Sqon;
                  setActiveSqon(newActiveSqon);
                }}
                onStateChange={state => {
                  setQbState(state);

                  // Get the active query from the new state and update activeSqon
                  const activeQuery = queryBuilderRemote.getResolvedActiveQuery(appId);
                  const newActiveSqon = resolveSyntheticSqon(
                    activeQuery,
                    (state?.queries || []) as ISyntheticSqon[],
                  ) as Sqon;
                  setActiveSqon(newActiveSqon);
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
                  loadingStates={{
                    total: fetchOccurrencesCount.isLoading,
                    list: fetchOccurrencesList.isLoading,
                  }}
                  pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
                  total={fetchOccurrencesCount.data?.count ?? 0}
                  enableColumnOrdering
                  enableFullscreen
                  serverOptions={{
                    setAdditionalFields,
                    defaultSorting: DEFAULT_SORTING,
                    onSortingChange: setSorting,
                  }}
                />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  );
}
export default CNVTab;
