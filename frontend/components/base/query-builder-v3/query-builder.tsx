import { useState } from 'react';
import { X } from 'lucide-react';
import useSWR from 'swr';

import { SavedFilter, SavedFilterType } from '@/api/index';
import { SidebarGroups } from '@/components/base/query-builder-v3//facets/sidebar-groups';
import { FacetList } from '@/components/base/query-builder-v3/facets/facet-list';
import { FacetConfigContext } from '@/components/base/query-builder-v3/facets/hooks/use-facet-config';
import { getAggregationsFetcher } from '@/components/base/query-builder-v3/hooks/use-aggregation-builder';
import { IQBContext, IQBFetcher, QBProvider } from '@/components/base/query-builder-v3/hooks/use-query-builder';
import { useQueryBuilderGetPreferenceEffect } from '@/components/base/query-builder-v3/hooks/use-query-builder-preference';
import { getVisibleAggregations } from '@/components/base/query-builder-v3/libs/aggregations';
import QueriesBarCard from '@/components/base/query-builder-v3/queries-bar-card';
import { QueryBuilderSkeleton } from '@/components/base/query-builder-v3/query-builder-skeleton';
import { SidebarProvider } from '@/components/base/shadcn/sidebar';
import { AggregationConfig, ApplicationId, AppsConfig, useConfig } from '@/components/cores/applications-config';
import { cn } from '@/components/lib/utils';
import { savedFiltersApi } from '@/utils/api';

import { ISavedFilterContextProps, SavedFiltersProvider } from './saved-filter/hooks/use-saved-filter';
import { useSavedFilterGetPreferenceEffect } from './saved-filter/hooks/use-saved-filters-preference';
import { SavedFilterInitializer } from './saved-filter/saved-filter-initializer';

type QueryBuilderLayoutProps = {
  appId: ApplicationId;
  children: React.ReactElement;
  defaultSidebarOpen?: boolean;
  fetcher: IQBFetcher;
};

export async function fetchSavedFilters(savedFilterType: SavedFilterType) {
  const response = await savedFiltersApi.getSavedFilters(savedFilterType);
  return response.data;
}

/**
 * Query-Builder (facets + query-bar)
 */
function QueryBuilder({ appId, defaultSidebarOpen = false, fetcher, children }: QueryBuilderLayoutProps) {
  const [open, setOpen] = useState(defaultSidebarOpen);
  const config = useConfig();
  const aggregations: AggregationConfig = (config[appId] as AppsConfig).aggregations;
  const visibleAggregations = getVisibleAggregations(aggregations);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string | null>(null);
  const [qbPreference, setQbPreference] = useState<IQBContext | undefined>();
  const [savedFilterPreference, setSavedFilterPreference] = useState<ISavedFilterContextProps | undefined>();
  const facetFetchers = getAggregationsFetcher(appId);
  const savedFilterType = (config[appId] as AppsConfig).saved_filter_type;

  useQueryBuilderGetPreferenceEffect({ appId, setPreference: setQbPreference });
  useSavedFilterGetPreferenceEffect({ savedFilterType, setPreference: setSavedFilterPreference });

  // Fetch saved filters
  const savedFilterFetcher = useSWR<SavedFilter[]>(
    `fetch-saved-filters-${savedFilterType}`,
    () => fetchSavedFilters(savedFilterType),
    {
      revalidateOnFocus: false,
    },
  );

  if (!qbPreference || !savedFilterPreference || savedFilterFetcher.isLoading) {
    return <QueryBuilderSkeleton defaultSidebarOpen={defaultSidebarOpen} aggregations={aggregations} />;
  }

  return (
    <QBProvider {...qbPreference} aggregations={aggregations} fetcher={fetcher}>
      <SavedFilterInitializer
        selectedSavedFilter={savedFilterPreference?.selectedSavedFilter}
        userPrefSqons={qbPreference?.sqons}
      >
        <FacetConfigContext value={{ appId, ...facetFetchers }}>
          <SavedFiltersProvider
            savedFilters={savedFilterFetcher.data || []}
            selectedSavedFilter={savedFilterPreference.selectedSavedFilter || undefined}
            savedFilterType={savedFilterType}
          >
            <div className="bg-muted w-full">
              <div className="flex flex-1 h-screen overflow-hidden">
                <aside className="w-auto min-w-fit h-full shrink-0">
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
                        <FacetList aggregations={visibleAggregations} groupKey={selectedSidebarItem} />
                      </div>
                    </div>
                  </SidebarProvider>
                </aside>
                <main className="flex-1 shrink px-3 pb-3 overflow-auto">
                  <div className="py-3 space-y-2">
                    <QueriesBarCard appId={appId} />
                  </div>
                  {children}
                </main>
              </div>
            </div>
          </SavedFiltersProvider>
        </FacetConfigContext>
      </SavedFilterInitializer>
    </QBProvider>
  );
}
export default QueryBuilder;
