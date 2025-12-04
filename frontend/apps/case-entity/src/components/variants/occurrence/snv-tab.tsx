import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PaginationState } from '@tanstack/react-table';
import { X } from 'lucide-react';
import useSWR from 'swr';

import {
  CaseAssay,
  Count,
  CountBodyWithSqon,
  GermlineSNVOccurrence,
  SavedFilterType,
  SortBody,
  SortBodyOrderEnum,
  Sqon,
} from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Card, CardContent } from '@/components/base/ui/card';
import { SidebarProvider } from '@/components/base/ui/sidebar';
import OccurrencePreviewSheet from '@/components/feature/preview/occurrence-preview-sheet';
import { usePreviewOccurrenceNavigation } from '@/components/feature/preview/use-preview-occurrence-navigation';
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

import { SELECTED_VARIANT_PARAM } from '../constants';
import { getVisibleAggregations } from '../utils';

import { defaultSNVSettings, getSNVOccurrenceColumns } from './table/snv-occurrence-table-settings';

const DEFAULT_SORTING = [
  {
    field: 'exomiser_gene_combined_score',
    order: SortBodyOrderEnum.Desc,
  },
  {
    field: 'max_impact_score',
    order: SortBodyOrderEnum.Desc,
  },
  {
    field: 'hgvsg',
    order: SortBodyOrderEnum.Asc,
  },
];

const ADDITIONAL_FIELDS = [
  'rsnumber',
  'symbol',
  'vep_impact',
  'is_mane_select',
  'is_canonical',
  'omim_inheritance_code',
  'clinvar',
  'exomiser_gene_combined_score',
  'exomiser_acmg_classification',
  'pf_wgs',
  'transcript_id',
  'has_interpretation',
];

async function fetchQueryCount(input: SnvOccurrenceLCountInput) {
  const response = await occurrencesApi.countGermlineSNVOccurrences(input.caseId, input.seqId, input.countBody);
  return response.data;
}

type SnvOccurrenceListInput = {
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

type SnvOccurrenceLCountInput = {
  caseId: string;
  seqId: string;
  countBody: CountBodyWithSqon;
};

type SNVTabProps = {
  seqId: string;
  patientSelected?: CaseAssay;
};

function SNVTab({ seqId, patientSelected }: SNVTabProps) {
  const { t } = useI18n();
  const config = useConfig();
  const { caseId } = useParams<{ caseId: string }>();
  const [rowSelection, setRowSelection] = useState({});
  const [isQBLoading, setQbLoading] = useState<boolean>(true);
  const [isQBInitialized, setQBInitialized] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [additionalFields, setAdditionalFields] = useState<string[]>(ADDITIONAL_FIELDS);

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

  const appId = config.snv_occurrence.app_id;
  const aggregations = config.snv_occurrence.aggregations;
  const visibleAggregations = getVisibleAggregations(aggregations);

  function getAggregationFromConfig(key: string) {
    return Object.values(config.snv_occurrence.aggregations)
      .flatMap(f => f.items)
      .find(f => f.key === key)!;
  }

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
      seqId && caseId
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
      seqId && caseId
        ? occurrencesApi.countGermlineSNVOccurrences(caseId, seqId, params.countBody).then(response => response.data)
        : { count: 0 },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

  const occurrencesData = useMemo(() => fetchOccurrencesList.data ?? [], [fetchOccurrencesList.data]);

  const {
    selectedOccurrence,
    hasPrevious,
    hasNext,
    handleClosePreview,
    handlePreviousOccurrence,
    handleNextOccurrence,
  } = usePreviewOccurrenceNavigation({
    occurrencesData,
    searchParams,
    setSearchParams,
    selectedOccurrenceParamKey: SELECTED_VARIANT_PARAM,
    setRowSelection,
  });

  /**
   * Restore activeSqon
   */
  useEffect(() => {
    if (isQBInitialized) return;

    getUserSavedFilters({
      savedFilterType: SavedFilterType.GERMLINE_SNV_OCCURRENCE,
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
                savedFilterType={SavedFilterType.GERMLINE_SNV_OCCURRENCE}
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
                  id="snv-occurrence"
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
                    defaultSorting: DEFAULT_SORTING,
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
            <OccurrencePreviewSheet
              open={!!selectedOccurrence}
              setOpen={() => handleClosePreview()}
              occurrence={selectedOccurrence!}
              onPrevious={handlePreviousOccurrence}
              onNext={handleNextOccurrence}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
              patientSelected={patientSelected}
            />
          </main>
        </div>
      </div>
    )
  );
}
export default SNVTab;
