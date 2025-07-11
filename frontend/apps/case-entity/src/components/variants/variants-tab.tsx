import { CaseEntity, Count, CountBodyWithSqon, ListBodyWithSqon, Occurrence, SortBody, SortBodyOrderEnum, Sqon } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';
import { occurrencesApi } from '@/utils/api';
import QueryBuilder from '@/components/feature/query-builder/query-builder';
import { useEffect, useState } from 'react';
import { SidebarProvider } from '@/components/base/ui/sidebar';
import { QueryBuilderState, resolveSyntheticSqon } from '@/components/model/query-builder-core';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { FilterList } from '@/components/feature/query-filters/filter-list';
import { SidebarGroups } from '@/components/feature/query-filters/sidebar-groups';
import { useConfig } from '@/components/model/applications-config';
import VariantIcon from '@/components/base/icons/variant-icon';
import { FilterComponent } from '@/components/feature/query-filters/filter-container';
import { useI18n } from '@/components/hooks/i18n';
import { X } from 'lucide-react';
import { cn } from '@/components/lib/utils';
import OccurrenceExpend from './occurrence-table/occurrence-expend';
import { defaultSettings, getVariantColumns } from './occurrence-table/table-settings';
import AssayVariantFilters from './filters/assay-variant-filters';

type OccurrencesListInput = {
  seqId: string;
  listBody: ListBodyWithSqon;
};

type OccurrenceCountInput = {
  seqId: string;
  countBody: CountBodyWithSqon;
};

const DEFAULT_SORTING = [
  {
    field: "max_impact_score",
    order: SortBodyOrderEnum.Desc
  },
  {
    field: "hgvsg",
    order: SortBodyOrderEnum.Asc
  },
  {
    field: 'pf_wgs',
    order: SortBodyOrderEnum.Asc,
  },
];

async function fetchOccurrencesList(input: OccurrencesListInput) {
  const response = await occurrencesApi.listGermlineOccurrences(input.seqId, input.listBody);
  return response.data;
}

async function fetchOccurrencesCount(input: OccurrenceCountInput) {
  const response = await occurrencesApi.countGermlineOccurrences(input.seqId, input.countBody);
  return response.data;
}


type VariantTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
}

function VariantTab({ caseEntity, isLoading }: VariantTabProps) {
  const config = useConfig();
  const { t } = useI18n();

  const [seqId, setSeqId] = useState<string>(caseEntity?.assays[0]?.seq_id.toString() ?? '');

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
  const { data: total, isLoading: totalIsLoading } = useSWR<Count, any, OccurrenceCountInput>(
    {
      seqId,
      countBody: { sqon: activeSqon },
    },
    fetchOccurrencesCount,
    {
      revalidateOnFocus: false,
    },
  );
  const [sorting, setSorting] = useState<SortBody[]>(DEFAULT_SORTING);
  const [open, setOpen] = useState(true);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string | null>(null);

  const appId = config.variant_exploration.app_id;

  // Variant list request
  const { data: list, isLoading: listIsLoading } = useSWR<Occurrence[], any, OccurrencesListInput>(
    {
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
          'pf_wgs',
          'transcript_id',
          'has_interpretation',
        ],
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
        sort: sorting,
        sqon: activeSqon,
      },
    },
    fetchOccurrencesList,
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    const localQbState = queryBuilderRemote.getLocalQueryBuilderState(appId);

    setQbState({
      ...localQbState,
      savedFilters: [],
      selectedQueryIndexes: [0],
    });
    setActiveSqon(queryBuilderRemote.getResolvedActiveQuery(appId) as Sqon);
  }, []);

  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  }, [JSON.stringify(qbState?.queries), qbState?.activeQueryId]);

  return (
    <div className='bg-background flex flex-col'>
      <AssayVariantFilters isLoading={isLoading} assays={caseEntity?.assays} handleChange={(value: string) => setSeqId(value)} />
      <div className='bg-muted/40 w-full'>
        <div className={`flex flex-1 h-screen overflow-hidden`}>
          <aside className="w-auto min-w-fit h-full shrink-0">
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
          </aside>
          <main className="flex-1 flex-shrink-1 p-4 overflow-auto">
            <h1 className="text-2xl font-bold">Variant</h1>
            <div className="py-4 space-y-2">
              <QueryBuilder
                id={appId}
                state={qbState}
                enableCombine
                enableFavorite
                enableShowHideLabels
                queryCountIcon={<VariantIcon size={14} />}
                fetchQueryCount={resolvedSqon =>
                  fetchOccurrencesCount({
                    seqId,
                    countBody: {
                      sqon: resolvedSqon,
                    },
                  }).then(res => res.count || 0)
                }
                resolveSyntheticSqon={resolveSyntheticSqon}
                onActiveQueryChange={sqon => setActiveSqon(resolveSyntheticSqon(sqon, qbState?.queries || []) as Sqon)}
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
            <DataTable
              id="variant-occurrence"
              columns={getVariantColumns(t)}
              data={list ?? []}
              defaultColumnSettings={defaultSettings}
              defaultServerSorting={DEFAULT_SORTING}
              loadingStates={{
                total: totalIsLoading,
                list: listIsLoading,
              }}
              pagination={pagination}
              onPaginationChange={setPagination}
              onServerSortingChange={setSorting}
              subComponent={data => <OccurrenceExpend occurrence={data} />}
              total={total?.count ?? 0}
              enableColumnOrdering
              enableFullscreen
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default VariantTab;
