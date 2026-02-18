import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { X } from 'lucide-react';
import { delay, http, HttpResponse } from 'msw';

import { FilterConfigContext, FilterList } from '@/components/base/query-filters/filter-list';
import { AggregateContext } from '@/components/base/query-filters/use-aggregation-builder';
import { SidebarProvider } from '@/components/base/shadcn/sidebar';
import { ApplicationId, ConfigProvider, FilterTypes, PortalConfig } from '@/components/cores/applications-config';
import { RangeOperators } from '@/components/cores/sqon';

import {
  httpOccurrenceAggregateApiResponse,
  httpOccurrenceAggregateStatisticsApiResponse,
  OccurenceHandler,
  occurrenceAggregateApi,
  occurrenceAggregateStatisticApi,
} from '../../api/api-occurrence';

const filterListConfig: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  snv_occurrence: {
    app_id: ApplicationId.snv_occurrence,
    aggregations: {
      variant: {
        items: [
          {
            key: 'multiple',
            translation_key: 'multiple',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'multiple (with dictionary)',
            translation_key: 'multiple (with dictionary)',
            type: FilterTypes.MULTIPLE,
            withDictionary: true,
          },
          {
            key: 'numerical (decimal)',
            translation_key: 'numerical (decimal)',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'numerical (integer)',
            translation_key: 'numerical (integer)',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'numerical (with unit)',
            translation_key: 'numerical (with unit)',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 120,
              defaultOperator: RangeOperators.Between,
              defaultMin: 0,
              defaultMax: 120,
              intervalDecimal: 0,
              rangeTypes: [
                { key: 'year', name: 'Year' },
                { key: 'month', name: 'Month' },
                { key: 'day', name: 'Day' },
              ],
            },
          },
          {
            key: 'numerical (no data)',
            translation_key: 'numerical (no data)',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: undefined,
              max: undefined,
              defaultOperator: RangeOperators.GreaterThan,
              noDataInputOption: true,
            },
          },
          {
            key: 'boolean',
            translation_key: 'toggle filter',
            type: FilterTypes.BOOLEAN,
          },
        ],
      },
    },
  },
  cnv_occurrence: {
    app_id: ApplicationId.cnv_occurrence,
    aggregations: {
      variant: {
        items: [
          {
            key: 'multiple',
            translation_key: 'multiple',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'numerical (decimal)',
            translation_key: 'numerical (decimal)',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'numerical (integer)',
            translation_key: 'numerical (integer)',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'has_interpretation',
            translation_key: 'has_interpretation',
            type: FilterTypes.BOOLEAN,
          },
        ],
      },
    },
  },
  admin: {
    admin_code: 'admin',
    app_id: ApplicationId.admin,
  },
  portal: {
    name: '',
    navigation: {},
  },
};

const meta = {
  title: 'QueryBuilder/Facets/FilterList',
  component: FilterList,
  args: {
    appId: filterListConfig.snv_occurrence.app_id,
    aggregations: filterListConfig.snv_occurrence.aggregations,
    groupKey: 'variant',
  },
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/case/1']}>
        <Routes>
          <Route
            path="/case/:caseId"
            element={
              <ConfigProvider config={filterListConfig}>
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
                          <Story />
                        </div>
                      </div>
                    </SidebarProvider>
                  </AggregateContext.Provider>
                </FilterConfigContext.Provider>
              </ConfigProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof FilterList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post<OccurenceHandler>(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse),
        http.post<OccurenceHandler>(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
      ],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(occurrenceAggregateApi, async () => {
          await delay(800);
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
