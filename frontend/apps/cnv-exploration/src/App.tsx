import { useEffect, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { SavedFilterType, SortBody, SortBodyOrderEnum, Sqon } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Card, CardContent } from '@/components/base/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/base/ui/select';
import { SidebarProvider } from '@/components/base/ui/sidebar';
import QueryBuilder from '@/components/feature/query-builder/query-builder';
import UserSavedFiltersProps, { getUserSavedFilters } from '@/components/feature/query-builder/user-saved-filters';
import { FilterComponent } from '@/components/feature/query-filters/filter-container';
import { FilterList } from '@/components/feature/query-filters/filter-list';
import { SidebarGroups } from '@/components/feature/query-filters/sidebar-groups';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';
import { useConfig } from '@/components/model/applications-config';
import { QueryBuilderState, resolveSyntheticSqon } from '@/components/model/query-builder-core';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';

import { defaultSettings, getCNVVariantColumns } from './table/table-settings';

const DEFAULT_SORTING = [
  {
    field: 'exomiser_gene_combined_score',
    order: SortBodyOrderEnum.Desc,
  },
];

export default function App() {
  const { t } = useI18n();
  const config = useConfig();

  // QueryBuilder
  const [isQBLoading, setQbLoading] = useState(true);
  const [isQBInitialized, setQBInitialized] = useState(false);
  const [qbState, setQbState] = useState<QueryBuilderState>();
  const [activeSqon, setActiveSqon] = useState<Sqon>({
    op: 'and',
    content: [],
  });

  // Facets
  const [open, setOpen] = useState(false);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string | null>(null);
  const aggregations = config.cnv_exploration.aggregations;

  // Table
  const [sorting, setSorting] = useState<SortBody[]>(DEFAULT_SORTING);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const appId = config.cnv_exploration.app_id;

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
    if (isQBInitialized) {
      setQbLoading(false);
    }
  }, [isQBInitialized]);

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
    <main className="bg-muted h-screen overflow-auto">
      <div className="bg-background flex flex-col">
        <div className="inline-flex gap-4 items-center border-b px-3 py-4">
          <Select>
            <SelectTrigger>Proband</SelectTrigger>
            <SelectContent>
              <SelectItem value="proband-1">Proband1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="bg-muted w-full">
          <div className="flex flex-1 h-screen overflow-hidden">
            <aside className="w-auto min-w-fit h-full shrink-0">
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
                    // TODO: Add call to API
                    console.log('resolvedSqon', resolvedSqon);
                    return 0;
                  }}
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
                  savedFilterType={SavedFilterType.GERMLINE_SNV_OCCURRENCE}
                  {...UserSavedFiltersProps}
                />
              </div>
              <Card>
                <CardContent>
                  <DataTable
                    id="cnv-exploration"
                    columns={getCNVVariantColumns(t)}
                    data={[]}
                    defaultColumnSettings={defaultSettings}
                    defaultServerSorting={DEFAULT_SORTING}
                    loadingStates={{
                      total: false,
                      list: false,
                    }}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    onServerSortingChange={setSorting}
                    total={0}
                    enableColumnOrdering
                    enableFullscreen
                  />
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}
