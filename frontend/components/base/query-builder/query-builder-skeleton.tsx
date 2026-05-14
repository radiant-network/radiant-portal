import { Card } from '@/components/base/shadcn/card';
import { Separator } from '@/components/base/shadcn/separator';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { AggregationConfig } from '@/components/cores/applications-config';

import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarProvider } from '../shadcn/sidebar';

type QueryBuilderSkeletonProps = {
  aggregations: AggregationConfig;
  defaultSidebarOpen: boolean;
};
export function QueryBuilderSkeleton({ defaultSidebarOpen, aggregations }: QueryBuilderSkeletonProps) {
  return (
    <div className="bg-muted w-full">
      <div className="flex flex-1 h-screen overflow-hidden">
        <aside className="w-auto min-w-fit h-full shrink-0">
          <div className="z-10">
            <SidebarProvider open={defaultSidebarOpen} className="h-full flex flex-row">
              <Sidebar
                variant="sidebar"
                collapsible="icon"
                className={'static! flex flex-col w-full bg-primary dark:bg-secondary '}
              >
                <SidebarContent>
                  <SidebarGroup>
                    <Skeleton className="size-8 mb-1" />
                    <SidebarMenu>
                      {Object.keys(aggregations).map(key => (
                        <Skeleton key={key} className="size-8 w-full" />
                      ))}
                    </SidebarMenu>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </SidebarProvider>
          </div>
        </aside>
        <main className="flex-1 shrink px-3 pb-3 overflow-auto">
          <div className="py-3 space-y-2">
            <Card className="py-0">
              <div className="flex flex-col">
                <div className="py-4 px-6 flex justify-between">
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-32" />
                    {new Array(2).fill(0).map((_, index) => (
                      <Skeleton key={index} className="size-8" />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {new Array(5).fill(0).map((_, index) => (
                      <Skeleton key={index} className="size-8" />
                    ))}
                    <Skeleton className="h-8 w-36" />
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col py-4 gap-4">
                  <div className="px-6 flex flex-col gap-2">
                    <Skeleton className="h-[50px] w-full" />
                    <Skeleton className="h-[50px] w-full" />
                  </div>
                  <div className="px-6 flex gap-3">
                    <Skeleton className="h-7 w-26" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
