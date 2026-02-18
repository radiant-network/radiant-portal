/* eslint-disable no-use-before-define */
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import axios from 'axios';
import { delay, http, HttpResponse } from 'msw';
import { mocked } from 'storybook/test';

import { TableColumnDef } from '@/components/base/data-table/data-table';
import QueryBuilder from '@/components/base/query-builder-v3/query-builder';
import QueryBuilderDataTable, {
  ICountInput,
  IListInput,
} from '@/components/base/query-builder-v3/query-builder-data-table';
import { ApplicationId, ConfigProvider, FilterTypes, PortalConfig } from '@/components/cores/applications-config';
import { RangeOperators } from '@/components/cores/sqon';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

import {
  httpOccurrenceAggregateApiResponse,
  httpOccurrenceAggregateStatisticsApiResponse,
  occurrenceAggregateApi,
  occurrenceAggregateStatisticApi,
} from '../api/api-occurrence';
import { httpUserPreferenceApiResponse, userPreferenceApi } from '../api/api-user-preference';
import { httpMockCountApiResponse, httpMockListApiResponse, mockCountApi, mockListApi } from '../api/mock-api';
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
  beforeEach: async () => {
    mocked(useCaseIdFromParam).mockReturnValue(1);
    mocked(useSeqIdFromSearchParam).mockReturnValue(1);
  },
  args: {},
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/case/1?seq_id=1']}>
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
        http.post(mockListApi, httpMockListApiResponse),
        http.post(mockCountApi, httpMockCountApiResponse),
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
        <QueryBuilderDataTable
          id="storybook-query-builder"
          fetcher={{
            list: async (params: IListInput) =>
              axios.post(mockListApi, { listBody: params.listBody }).then(response => response.data),
            count: async (params: ICountInput) =>
              axios.post(mockCountApi, { countBody: params.countBody }).then(response => response.data),
          }}
          columns={
            [
              ...mockColumns,
              mockColumnHelper.accessor('isActive', {
                header: 'Active',
              }),
            ] as TableColumnDef<TableMockData, any>[]
          }
          defaultColumnSettings={[]}
        />
      </QueryBuilder>
    </>
  ),
};

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(mockListApi, httpMockListApiResponse),
        http.post(mockCountApi, httpMockCountApiResponse),
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
  render: args => (
    <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen}>
      <QueryBuilderDataTable
        id="storybook-query-builder"
        fetcher={{
          list: async (params: IListInput) =>
            axios.post(mockListApi, { listBody: params.listBody }).then(response => response.data),
          count: async (params: ICountInput) =>
            axios.post(mockCountApi, { countBody: params.countBody }).then(response => response.data),
        }}
        columns={
          [
            ...mockColumns,
            mockColumnHelper.accessor('isActive', {
              header: 'Active',
            }),
          ] as TableColumnDef<TableMockData, any>[]
        }
        defaultColumnSettings={[]}
      />
    </QueryBuilder>
  ),
};

export const Multiselect: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(mockListApi, httpMockListApiResponse),
        http.post(mockCountApi, httpMockCountApiResponse),
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
  render: args => (
    <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen}>
      <QueryBuilderDataTable
        id="storybook-query-builder"
        fetcher={{
          list: async (params: IListInput) =>
            axios.post(mockListApi, { listBody: params.listBody }).then(response => response.data),
          count: async (params: ICountInput) =>
            axios.post(mockCountApi, { countBody: params.countBody }).then(response => response.data),
        }}
        columns={
          [
            ...mockColumns,
            mockColumnHelper.accessor('isActive', {
              header: 'Active',
            }),
          ] as TableColumnDef<TableMockData, any>[]
        }
        defaultColumnSettings={[]}
      />
    </QueryBuilder>
  ),
};
