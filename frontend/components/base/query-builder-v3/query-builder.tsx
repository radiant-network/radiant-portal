// @TODO: Facets > FilterTypes should be renamed to FacetTypes
// @TODO: Facets > i18n should not use filter for his key by facet
// @TODO: Facets > useOccurrenceAggregationBuilder should be able to have optional withDictionary params. Use object insteads of multiples parameters
import { useState } from 'react';
import { X } from 'lucide-react';

import { SidebarGroups } from '@/components/base/query-builder-v3/facets/sidebar-groups';
import { SidebarProvider } from '@/components/base/shadcn/sidebar';
import { AggregationConfig, ApplicationId, AppsConfig, useConfig } from '@/components/cores/applications-config';
import { cn } from '@/components/lib/utils';

import { FacetList } from './facets/facet-list';
import { QBProvider } from './hooks/query-builder-context';
import Query from './query';

type QueryBuilderLayoutProps = {
  appId: ApplicationId;
  children: React.ReactElement;
  defaultSidebarOpen?: boolean;
};

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

function QueryBuilder({ appId, defaultSidebarOpen = false, children }: QueryBuilderLayoutProps) {
  const [open, setOpen] = useState(defaultSidebarOpen);
  const config = useConfig();
  const visibleAggregations = getVisibleAggregations((config[appId] as AppsConfig).aggregations);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string | null>(null);

  return (
    <QBProvider>
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
                  <FacetList appId={appId} aggregations={visibleAggregations} groupKey={selectedSidebarItem} />
                </div>
              </div>
            </SidebarProvider>
          </aside>
          <main className="flex-1 shrink px-3 pb-3 overflow-auto">
            <div className="py-3 space-y-2">
              <Query />
            </div>
            {children}
          </main>
        </div>
      </div>
    </QBProvider>
  );
}
export default QueryBuilder;
