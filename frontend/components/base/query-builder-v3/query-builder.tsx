import { useState } from 'react';
import { X } from 'lucide-react';

import { SidebarGroups } from '@/components/base/query-builder-v3//facets/sidebar-groups';
import { FacetList } from '@/components/base/query-builder-v3/facets/facet-list';
import { FacetConfigContext } from '@/components/base/query-builder-v3/facets/hooks/use-facet-config';
import { getAggregationsFetcher } from '@/components/base/query-builder-v3/hooks/use-aggregation-builder';
import { IQBContext, QBProvider } from '@/components/base/query-builder-v3/hooks/use-query-builder';
import { useQueryBuilderGetPreferenceEffect } from '@/components/base/query-builder-v3/hooks/use-query-builder-preference';
import { getVisibleAggregations } from '@/components/base/query-builder-v3/libs/facet-libs';
import QueriesBarCard from '@/components/base/query-builder-v3/queries-bar-card';
import { QueryBuilderSkeleton } from '@/components/base/query-builder-v3/query-builder-skeleton';
import { SidebarProvider } from '@/components/base/shadcn/sidebar';
import { AggregationConfig, ApplicationId, AppsConfig, useConfig } from '@/components/cores/applications-config';
import { cn } from '@/components/lib/utils';

type QueryBuilderLayoutProps = {
  appId: ApplicationId;
  children: React.ReactElement;
  defaultSidebarOpen?: boolean;
};

/**
 * Query-Builder (facets + query-bar)
 */
function QueryBuilder({ appId, defaultSidebarOpen = false, children }: QueryBuilderLayoutProps) {
  const [open, setOpen] = useState(defaultSidebarOpen);
  const config = useConfig();
  const aggregations: AggregationConfig = (config[appId] as AppsConfig).aggregations;
  const visibleAggregations = getVisibleAggregations(aggregations);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string | null>(null);
  const [preference, setPreference] = useState<IQBContext | undefined>();
  const facetFetchers = getAggregationsFetcher(appId);

  useQueryBuilderGetPreferenceEffect({ appId, setPreference });

  if (!preference) {
    return <QueryBuilderSkeleton defaultSidebarOpen={defaultSidebarOpen} aggregations={aggregations} />;
  }

  return (
    <QBProvider {...preference} aggregations={aggregations}>
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
                  <FacetConfigContext value={{ appId, ...facetFetchers }}>
                    <FacetList aggregations={visibleAggregations} groupKey={selectedSidebarItem} />
                  </FacetConfigContext>
                </div>
              </div>
            </SidebarProvider>
          </aside>
          <main className="flex-1 shrink px-3 pb-3 overflow-auto">
            <div className="py-3 space-y-2">
              <QueriesBarCard />
            </div>
            {children}
          </main>
        </div>
      </div>
    </QBProvider>
  );
}
export default QueryBuilder;
