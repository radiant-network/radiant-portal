/* eslint-disable no-use-before-define */
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { delay, http, HttpResponse } from 'msw';
import useSWR from 'swr';

import DataTable, { TableColumnDef } from '@/components/base/data-table/data-table';
import QueryBuilder from '@/components/base/query-builder-v3/query-builder';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { ApplicationId, ConfigProvider, FilterTypes, PortalConfig } from '@/components/cores/applications-config';
import { RangeOperators } from '@/components/cores/sqon';
import { occurrencesApi } from '@/utils/api';

import {
  httpOccurrenceAggregateApiResponse,
  httpOccurrenceAggregateStatisticsApiResponse,
  httpOccurrenceListApiResponse,
  occurrenceAggregateApi,
  occurrenceAggregateStatisticApi,
  occurrenceListApi,
} from '../api/api-occurrence';
import { httpUserPreferenceApiResponse, userPreferenceApi } from '../api/api-user-preference';
import { mockColumnHelper, mockColumns, TableMockData } from '../table/table-mock';

const facetListConfig: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  snv_occurrence: {
    app_id: ApplicationId.snv_occurrence,
    aggregations: {
      variant: {
        items: [
          {
            key: 'firstName',
            translation_key: 'multiple',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'lastName',
            translation_key: 'multiple (with dictionary)',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'status',
            translation_key: 'status (with dictionary)',
            type: FilterTypes.MULTIPLE,
            withDictionary: true,
          },
          {
            key: 'divider',
            translation_key: 'Divider',
            type: FilterTypes.DIVIDER,
          },
          {
            key: 'progress',
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
            key: 'age',
            translation_key: 'Age (integer)',
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
            key: 'visits',
            translation_key: 'Visits (integer)',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 1000,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 1000,
            },
          },
          {
            key: 'isActive',
            translation_key: 'isActive (boolean)',
            type: FilterTypes.BOOLEAN,
          },
        ],
      },
      gene: {
        items: [
          {
            key: 'lastName',
            translation_key: 'multiple (with dictionary)',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'progress',
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
            key: 'age',
            translation_key: 'Age (integer)',
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
            key: 'isActive',
            translation_key: 'isActive (boolean)',
            type: FilterTypes.BOOLEAN,
          },
        ],
      },
    },
  },
  cnv_occurrence: {
    app_id: ApplicationId.cnv_occurrence,
    aggregations: {
      pathogenicity: {
        items: [
          {
            key: 'firstName',
            translation_key: 'multiple',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'lastName',
            translation_key: 'multiple (with dictionary)',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'status',
            translation_key: 'status (with dictionary)',
            type: FilterTypes.MULTIPLE,
            withDictionary: true,
          },
          {
            key: 'divider',
            translation_key: 'Divider',
            type: FilterTypes.DIVIDER,
          },
          {
            key: 'progress',
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
            key: 'age',
            translation_key: 'Age (integer)',
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
            key: 'visits',
            translation_key: 'Visits (integer)',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 1000,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 1000,
            },
          },
          {
            key: 'isActive',
            translation_key: 'isActive (boolean)',
            type: FilterTypes.BOOLEAN,
          },
        ],
      },
      frequency: {
        items: [
          {
            key: 'lastName',
            translation_key: 'multiple (with dictionary)',
            type: FilterTypes.MULTIPLE,
          },
          {
            key: 'progress',
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
            key: 'age',
            translation_key: 'Age (integer)',
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
            key: 'isActive',
            translation_key: 'isActive (boolean)',
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
  title: 'QueryBuilder/QueryBuilderV3',
  component: QueryBuilder,
  args: {},
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/case/1']}>
        <Routes>
          <Route
            path="/case/:caseId"
            element={
              <ConfigProvider config={facetListConfig}>
                <Story />
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

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(occurrenceListApi, httpOccurrenceListApiResponse),
        http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse),
        http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
        http.get(userPreferenceApi, async () => {
          await delay(10000);
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
  args: {
    appId: ApplicationId.snv_occurrence,
    children: <></>, // unused
    defaultSidebarOpen: true,
  },
  render: args => (
    <>
      <div className="bold font-mono text-red">Do a hard refresh to reset loading state</div>
      <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen}>
        <Card>
          <CardContent>
            <DataTable
              id="storybook-query-builder"
              columns={
                [
                  ...mockColumns,
                  mockColumnHelper.accessor('isActive', {
                    header: 'Active',
                  }),
                ] as TableColumnDef<TableMockData, any>[]
              }
              data={[]}
              loadingStates={{
                total: false,
                list: false,
              }}
              defaultColumnSettings={[]}
              pagination={{
                type: 'hidden',
                state: undefined,
                onPaginationChange: undefined,
              }}
            />
          </CardContent>
        </Card>
      </QueryBuilder>
    </>
  ),
};

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(occurrenceListApi, httpOccurrenceListApiResponse),
        http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse),
        http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
        http.get(userPreferenceApi, httpUserPreferenceApiResponse),
      ],
    },
  },
  args: {
    appId: ApplicationId.cnv_occurrence,
    children: <></>, // unused
    defaultSidebarOpen: true,
  },
  render: args => {
    const activeSqon = {
      op: 'and',
      content: [],
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetchOccurrencesList = useSWR<any[]>(
      {
        caseId: 1,
        seqId: 1,
        listBody: {
          limit: 10,
          page_index: 0,
          sort: [],
          sqon: activeSqon,
        },
      },
      async (params: any) =>
        occurrencesApi.listGermlineSNVOccurrences(1, 1, params.listBody).then(response => response.data),
      {
        revalidateOnFocus: false,
        revalidateOnMount: true,
        shouldRetryOnError: false,
      },
    );

    return (
      <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen}>
        <Card>
          <CardContent>
            <DataTable
              id="storybook-query-builder"
              columns={
                [
                  ...mockColumns,
                  mockColumnHelper.accessor('isActive', {
                    header: 'Active',
                  }),
                ] as TableColumnDef<TableMockData, any>[]
              }
              data={fetchOccurrencesList.data ?? []}
              loadingStates={{
                total: false,
                list: false,
              }}
              defaultColumnSettings={[]}
              pagination={{
                type: 'hidden',
                state: undefined,
                onPaginationChange: undefined,
              }}
            />
          </CardContent>
        </Card>
      </QueryBuilder>
    );
  },
};

export const Multiselect: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(occurrenceListApi, httpOccurrenceListApiResponse),
        http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse),
        http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
        http.get(userPreferenceApi, httpUserPreferenceApiResponse),
      ],
    },
  },
  args: {
    appId: ApplicationId.snv_occurrence,
    children: <></>, // unused
    defaultSidebarOpen: true,
  },
  render: args => {
    const activeSqon = {
      op: 'and',
      content: [],
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetchOccurrencesList = useSWR<any[]>(
      {
        caseId: 1,
        seqId: 1,
        listBody: {
          limit: 10,
          page_index: 0,
          sort: [],
          sqon: activeSqon,
        },
      },
      async (params: any) =>
        occurrencesApi.listGermlineSNVOccurrences(1, 1, params.listBody).then(response => response.data),
      {
        revalidateOnFocus: false,
        revalidateOnMount: true,
        shouldRetryOnError: false,
      },
    );

    return (
      <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen}>
        <Card>
          <CardContent>
            <DataTable
              id="storybook-query-builder"
              columns={
                [
                  ...mockColumns,
                  mockColumnHelper.accessor('isActive', {
                    header: 'Active',
                  }),
                ] as TableColumnDef<TableMockData, any>[]
              }
              data={fetchOccurrencesList.data ?? []}
              loadingStates={{
                total: false,
                list: false,
              }}
              defaultColumnSettings={[]}
              pagination={{
                type: 'hidden',
                state: undefined,
                onPaginationChange: undefined,
              }}
            />
          </CardContent>
        </Card>
      </QueryBuilder>
    );
  },
};
