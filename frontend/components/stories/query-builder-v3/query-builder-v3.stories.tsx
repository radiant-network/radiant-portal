import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { X } from 'lucide-react';
import { http } from 'msw';

import QueryBuilder from '@/components/base/query-builder-v3/query-builder';
import { FilterConfigContext, FilterList } from '@/components/base/query-filters/filter-list';
import { AggregateContext } from '@/components/base/query-filters/use-aggregation-builder';
import { SidebarProvider } from '@/components/base/shadcn/sidebar';
import { ConfigProvider } from '@/components/cores/applications-config';

import {
  httpOccurrenceApiResponse,
  httpStatisticsApiResponse,
  occurrenceApi,
  statisticApi,
} from '../api/api-occurrence';
import { filterListConfig } from '../query-builder/facets/filter-list.stories';

const meta = {
  title: 'QueryBuilderV3',
  component: QueryBuilder,
  args: {},
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/case/1']}>
        <Routes>
          <Route
            path="/case/:caseId"
            element={
              <ConfigProvider config={filterListConfig}>
                <div className="bg-muted w-full">
                  <div className="flex flex-1 h-screen overflow-hidden">
                    <aside className="w-auto min-w-fit h-full shrink-0">
                      <FilterConfigContext.Provider
                        value={{
                          appId: filterListConfig.snv_occurrence.app_id,
                          aggregations: filterListConfig.snv_occurrence.aggregations,
                        }}
                      >
                        <AggregateContext.Provider value={{ caseId: 1, seqId: 1 }}>
                          <SidebarProvider className="h-full flex flex-row">
                            <div className="bg-muted overflow-auto mb-16 border-r transition-[width] duration-300 ease-in-out w-[280px] p-4 opacity-100 relative">
                              <div className="whitespace-nowrap">
                                <div className="flex justify-end mb-4">
                                  <button className="text-muted-foreground hover:text-foreground">
                                    <X size={16} />
                                  </button>
                                </div>

                                <FilterList
                                  appId={filterListConfig.snv_occurrence.app_id}
                                  aggregations={filterListConfig.snv_occurrence.aggregations}
                                  groupKey="variant"
                                />
                              </div>
                            </div>
                          </SidebarProvider>
                        </AggregateContext.Provider>
                      </FilterConfigContext.Provider>
                    </aside>
                    <div className="flex-1 shrink px-3 pb-3 overflow-auto">
                      <div className="py-3 space-y-2">
                        <Story />
                      </div>
                    </div>
                  </div>
                </div>
              </ConfigProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof QueryBuilder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(occurrenceApi, httpOccurrenceApiResponse),
        http.post(statisticApi, httpStatisticsApiResponse),
      ],
    },
  },
  args: {},
  render: () => <QueryBuilder />,
};
