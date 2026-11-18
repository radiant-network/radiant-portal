import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import useSWR from 'swr';

import type { SavedFilter, SavedFilterType } from '@/api/index';
import { FacetList } from '@/components/base/query-builder/facets/facet-list';
import FavoritesFacetCollection from '@/components/base/query-builder/facets/favorite/favorites-facet-collection';
import { FavoritesProvider } from '@/components/base/query-builder/facets/favorite/hooks/use-favorites';
import { useFavoritesPreference } from '@/components/base/query-builder/facets/favorite/hooks/use-favorites-preference';
import { FacetConfigContext } from '@/components/base/query-builder/facets/hooks/use-facet-config';
import { FAVORITES_SIDEBAR_ID, SidebarGroups } from '@/components/base/query-builder/facets/sidebar-groups';
import { getAggregationsFetcher } from '@/components/base/query-builder/hooks/use-aggregation-builder';
import { type IQBContext, type IQBFetcher, QBProvider } from '@/components/base/query-builder/hooks/use-query-builder';
import { useQueryBuilderGetPreferenceEffect } from '@/components/base/query-builder/hooks/use-query-builder-preference';
import { getVisibleAggregations } from '@/components/base/query-builder/libs/aggregations';
import QueriesBarCard from '@/components/base/query-builder/queries-bar-card';
import { QueryBuilderSkeleton } from '@/components/base/query-builder/query-builder-skeleton';
import { SidebarProvider } from '@/components/base/shadcn/sidebar';
import {
  type AggregationConfig,
  type ApplicationId,
  type AppsConfig,
  useConfig,
} from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import useIsMobile from '@/components/hooks/use-is-mobile';
import { cn } from '@/components/lib/utils';
import { savedFiltersApi } from '@/utils/api';

import { type ISavedFilterContextProps, SavedFiltersProvider } from './saved-filter/hooks/use-saved-filter';
import { useSavedFilterGetPreferenceEffect } from './saved-filter/hooks/use-saved-filters-preference';
import { SavedFilterInitializer } from './saved-filter/saved-filter-initializer';

type QueryBuilderLayoutProps = {
  appId: ApplicationId;
  children: React.ReactElement;
  defaultSidebarOpen?: boolean;
  fetcher: IQBFetcher;
  swrId?: string;
};

export async function fetchSavedFilters(savedFilterType: SavedFilterType) {
  const response = await savedFiltersApi.getSavedFilters(savedFilterType);
  return response.data;
}

/**
 * Query-Builder (facets + query-bar)
 */
function QueryBuilder({ appId, defaultSidebarOpen = false, fetcher, swrId, children }: QueryBuilderLayoutProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(defaultSidebarOpen);
  const config = useConfig();
  const isMobile = useIsMobile();
  const aggregations: AggregationConfig = (config[appId] as AppsConfig).aggregations;
  const visibleAggregations = getVisibleAggregations(aggregations);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string | null>(null);
  const [qbPreference, setQbPreference] = useState<IQBContext | undefined>();
  const [savedFilterPreference, setSavedFilterPreference] = useState<ISavedFilterContextProps | undefined>();
  const [hasInitializedSidebarItem, setHasInitializedSidebarItem] = useState(false);
  const facetFetchers = getAggregationsFetcher(appId);
  const savedFilterType = (config[appId] as AppsConfig).saved_filter_type;
  const favoritesPref = useFavoritesPreference(appId);

  useQueryBuilderGetPreferenceEffect({ appId, setPreference: setQbPreference });
  useSavedFilterGetPreferenceEffect({ savedFilterType, setPreference: setSavedFilterPreference });

  useEffect(() => {
    if (!isMobile) return;
    setOpen(false);
    setSelectedSidebarItem(null);
  }, [isMobile]);

  useEffect(() => {
    if (favoritesPref.isLoading || hasInitializedSidebarItem) return;
    if (favoritesPref.favorites.length > 0) {
      setSelectedSidebarItem(FAVORITES_SIDEBAR_ID);
    }
    setHasInitializedSidebarItem(true);
  }, [favoritesPref.isLoading, favoritesPref.favorites.length, hasInitializedSidebarItem]);

  // Fetch saved filters
  const savedFilterFetcher = useSWR<SavedFilter[]>(
    `fetch-saved-filters-${savedFilterType}`,
    () => fetchSavedFilters(savedFilterType),
    {
      revalidateOnFocus: false,
    },
  );

  if (
    !qbPreference ||
    !savedFilterPreference ||
    savedFilterFetcher.isLoading ||
    favoritesPref.isLoading ||
    !hasInitializedSidebarItem
  ) {
    return <QueryBuilderSkeleton defaultSidebarOpen={defaultSidebarOpen} aggregations={aggregations} />;
  }

  return (
    <QBProvider {...qbPreference} aggregations={aggregations} fetcher={fetcher}>
      <SavedFilterInitializer
        selectedSavedFilter={savedFilterPreference?.selectedSavedFilter}
        userPrefSqons={qbPreference?.sqons}
      >
        <FacetConfigContext value={{ appId, ...facetFetchers }}>
          <FavoritesProvider appId={appId}>
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
                          'w-73 p-3 opacity-100 relative': selectedSidebarItem,
                          'w-0 opacity-0': !selectedSidebarItem,
                        })}
                      >
                        <div className="whitespace-nowrap">
                          <div className="flex justify-end mb-4">
                            <button
                              onClick={() => setSelectedSidebarItem(null)}
                              className="text-muted-foreground hover:text-foreground"
                              aria-label={t('a11y.query_builder.close_facets')}
                            >
                              <X size={16} />
                            </button>
                          </div>
                          {selectedSidebarItem === FAVORITES_SIDEBAR_ID ? (
                            <FavoritesFacetCollection aggregations={visibleAggregations} />
                          ) : (
                            <FacetList aggregations={visibleAggregations} groupKey={selectedSidebarItem} />
                          )}
                        </div>
                      </div>
                    </SidebarProvider>
                  </aside>
                  <main className="flex-1 shrink px-3 pb-3 overflow-auto">
                    <div className="py-3 space-y-2">
                      <QueriesBarCard appId={appId} swrId={swrId} />
                    </div>
                    {children}
                  </main>
                </div>
              </div>
            </SavedFiltersProvider>
          </FavoritesProvider>
        </FacetConfigContext>
      </SavedFilterInitializer>
    </QBProvider>
  );
}
export default QueryBuilder;
