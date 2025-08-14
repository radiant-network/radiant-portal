import { createContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { PaginationState } from '@tanstack/react-table';
import { X } from 'lucide-react';
import useSWR from 'swr';

import { CaseEntity, Count, GermlineSNVOccurrence, SortBody, SortBodyOrderEnum, Sqon } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Card, CardContent } from '@/components/base/ui/card';
import { SidebarProvider } from '@/components/base/ui/sidebar';
import QueryBuilder from '@/components/feature/query-builder/query-builder';
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

import AssayVariantFilters from './filters/assay-variant-filters';
import OccurrenceExpand from './occurrence-table/occurrence-expand';
import { defaultSettings, getVariantColumns } from './occurrence-table/table-settings';
import { OccurrenceCountInput, useOccurencesCountHelper, useOccurencesListHelper } from './hook';

export const SeqIDContext = createContext<string>('');

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

type VariantTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
};

async function fetchQueryCount(input: OccurrenceCountInput) {
  const response = await occurrencesApi.countGermlineSNVOccurrences(input.seqId, input.countBody);
  return response.data;
}

function VariantTab({ caseEntity, isLoading }: VariantTabProps) {
  const config = useConfig();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useI18n();

  // only use assay with variants
  const assaysWithVariants = caseEntity?.assays.filter(assay => assay.has_variants) ?? [];

  let defaultSeqId = searchParams.get('seq_id') ?? '';
  if (!defaultSeqId && assaysWithVariants[0]?.seq_id.toString()) {
    defaultSeqId = assaysWithVariants[0]?.seq_id.toString();
  }
  const [seqId, setSeqId] = useState<string>(defaultSeqId);

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

  const appId = config.variant_exploration.app_id;

  // Variant list request
  const { fetch: fetchOccurrencesListHelper } = useOccurencesListHelper({
    seqId,
    listBody: {
      additional_fields: [
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
      ],
      limit: pagination.pageSize,
      page_index: pagination.pageIndex,
      sort: sorting,
      sqon: activeSqon,
    },
  });

  const { fetch: fetchOccurrencesCountHelper } = useOccurencesCountHelper({
    seqId,
    countBody: { sqon: activeSqon },
  });

  const fetchOccurrencesList = useSWR<GermlineSNVOccurrence[]>('fetch-occurences-list', fetchOccurrencesListHelper, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    shouldRetryOnError: false,
  });

  const fetchOccurrencesCount = useSWR<Count>('fetch-occurences-count', fetchOccurrencesCountHelper, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (searchParams.get('seq_id') != null) {
      setSeqId(searchParams.get('seq_id') ?? '');
      return;
    }

    const assays = caseEntity?.assays ?? [];
    if (assays.length === 0) return;

    const assaysWithVariants = assays.filter(assay => assay.has_variants);
    if (assaysWithVariants.length === 0) return;

    setSeqId(assaysWithVariants[0].seq_id.toString());
  }, [searchParams, caseEntity]);

  useEffect(() => {
    const localQbState = queryBuilderRemote.getLocalQueryBuilderState(appId);

    setQbState({
      ...localQbState,
      savedFilters: [],
      selectedQueryIndexes: [0],
    });
    setActiveSqon(queryBuilderRemote.getResolvedActiveQuery(appId) as Sqon);
  }, []);

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
    <SeqIDContext value={seqId}>
      <div className="bg-background flex flex-col">
        <AssayVariantFilters
          isLoading={isLoading}
          assays={assaysWithVariants}
          value={seqId}
          handleChange={(value: string) => {
            searchParams.set('seq_id', value);
            setSearchParams(searchParams, { replace: true });
            setSeqId(value);
          }}
        />
        <div className="bg-muted w-full">
          <div className={`flex flex-1 h-screen overflow-hidden`}>
            <aside className="w-auto min-w-fit h-full shrink-0">
              <AggregateContext value={{ seqId }}>
                <SidebarProvider open={open} onOpenChange={setOpen} className="h-full flex flex-row">
                  <div className="z-10">
                    <SidebarGroups selectedItemId={selectedSidebarItem} onItemSelect={setSelectedSidebarItem} />
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
                      <FilterList groupKey={selectedSidebarItem} />
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
                  queryCountIcon={<VariantIcon size={14} />}
                  fetchQueryCount={resolvedSqon =>
                    fetchQueryCount({
                      seqId,
                      countBody: {
                        sqon: resolvedSqon,
                      },
                    }).then(res => res.count || 0)
                  }
                  resolveSyntheticSqon={resolveSyntheticSqon}
                  onActiveQueryChange={sqon =>
                    setActiveSqon(resolveSyntheticSqon(sqon, qbState?.queries || []) as Sqon)
                  }
                  onStateChange={state => {
                    setQbState(state);
                  }}
                  queryPillFacetFilterConfig={{
                    enable: true,
                    blacklistedFacets: ['locus_id'],
                    onFacetClick: filter => {
                      const fields = Object.values(config.variant_exploration.aggregations)
                        .flatMap(f => f.items)
                        .find(f => f.key === filter.content.field)!;

                      return <FilterComponent field={fields} isOpen={true} />;
                    },
                  }}
                />
              </div>
              <Card>
                <CardContent>
                  <DataTable
                    id="variant-occurrence"
                    columns={getVariantColumns(t)}
                    data={fetchOccurrencesList.data ?? []}
                    defaultColumnSettings={defaultSettings}
                    defaultServerSorting={DEFAULT_SORTING}
                    loadingStates={{
                      total: fetchOccurrencesCount.isLoading,
                      list: fetchOccurrencesList.isLoading,
                    }}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    onServerSortingChange={setSorting}
                    subComponent={data => <OccurrenceExpand occurrence={data} />}
                    total={fetchOccurrencesCount.data?.count ?? 0}
                    enableColumnOrdering
                    enableFullscreen
                  />
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </div>
    </SeqIDContext>
  );
}

export default VariantTab;
