/* eslint-disable no-use-before-define */
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import axios from 'axios';
import { delay, http, HttpResponse } from 'msw';
import { mocked } from 'storybook/test';

import { TableColumnDef } from '@/components/base/data-table/data-table';
import {
  getDefaultQBContext,
  ICountInput,
  IListInput,
} from '@/components/base/query-builder-v3/hooks/use-query-builder';
import QueryBuilder from '@/components/base/query-builder-v3/query-builder';
import QueryBuilderDataTable from '@/components/base/query-builder-v3/query-builder-data-table';
import { ApplicationId, ConfigProvider, FilterTypes, PortalConfig } from '@/components/cores/applications-config';
import { RangeOperators } from '@/components/cores/sqon';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

import {
  httpOccurrenceAggregateApiResponse,
  httpOccurrenceAggregateStatisticsApiResponse,
  occurrenceAggregateApi,
  occurrenceAggregateStatisticApi,
} from '../api/api-occurrence';
import { userPreferenceApi } from '../api/api-user-preference';
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
              noDataInputOption: true,
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
          {
            key: 'search_by_gene_symbol',
            translation_key: 'search_by_symbol',
            type: FilterTypes.SEARCH_BY,
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
  args: {
    fetcher: {
      list: async (params: IListInput) =>
        axios.post(mockListApi, { listBody: params.listBody }).then(response => response.data),
      count: async (params: ICountInput) =>
        axios.post(mockCountApi, { countBody: params.countBody }).then(response => response.data),
    },
  },
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
      <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
        <QueryBuilderDataTable
          id="storybook-query-builder"
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
        http.get(userPreferenceApi, () => new HttpResponse(null, { status: 404 })),
      ],
    },
  },
  args: {
    appId: ApplicationId.cnv_occurrence,
    children: <></>, // unused
    defaultSidebarOpen: true,
  },
  render: args => (
    <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable
        id="storybook-query-builder"
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
        http.get(userPreferenceApi, ({ params }: any) => {
          const key = params.key;
          if (key === 'data-table-storybook-query-builder') {
            return new HttpResponse(null, { status: 404 });
          }
          return HttpResponse.json({
            ...getDefaultQBContext(),
            activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b603',
            sqons: [
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
                content: [
                  {
                    content: {
                      field: 'firstName',
                      value: ['henry', 'jack', 'irene', 'liam', 'olivia', 'tanner'],
                    },
                    op: 'in',
                  },
                  {
                    content: {
                      field: 'lastName',
                      value: ['tremblay', 'anderson', 'young'],
                    },
                    op: 'in',
                  },
                  {
                    content: {
                      field: 'status',
                      value: ['single'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
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
    <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable
        id="storybook-query-builder"
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

export const Boolean: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(mockListApi, httpMockListApiResponse),
        http.post(mockCountApi, httpMockCountApiResponse),
        http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse),
        http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
        http.get(userPreferenceApi, ({ params }: any) => {
          const key = params.key;
          if (key === 'data-table-storybook-query-builder') {
            return new HttpResponse(null, { status: 404 });
          }
          return HttpResponse.json({
            ...getDefaultQBContext(),
            activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b603',
            sqons: [
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
                content: [
                  {
                    content: {
                      field: 'isActive',
                      value: ['true'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
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
    <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable
        id="storybook-query-builder"
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

export const Numerical: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(mockListApi, httpMockListApiResponse),
        http.post(mockCountApi, httpMockCountApiResponse),
        http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse),
        http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
        http.get(userPreferenceApi, ({ params }: any) => {
          const key = params.key;
          if (key === 'data-table-storybook-query-builder') {
            return new HttpResponse(null, { status: 404 });
          }
          return HttpResponse.json({
            ...getDefaultQBContext(),
            activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b603',
            sqons: [
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
                content: [
                  {
                    content: {
                      field: 'progress',
                      value: ['50'],
                    },
                    op: '<',
                  },
                  {
                    content: {
                      field: 'visits',
                      value: ['1', '100'],
                    },
                    op: 'between',
                  },
                ],
                op: 'and',
              },
            ],
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
    <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable
        id="storybook-query-builder"
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

export const MultiQueries: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(mockListApi, httpMockListApiResponse),
        http.post(mockCountApi, httpMockCountApiResponse),
        http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse),
        http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
        http.get(userPreferenceApi, ({ params }: any) => {
          const key = params.key;
          if (key === 'data-table-storybook-query-builder') {
            return new HttpResponse(null, { status: 404 });
          }
          return HttpResponse.json({
            ...getDefaultQBContext(),
            activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b605',
            sqons: [
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
                content: [
                  {
                    content: {
                      field: 'firstName',
                      value: ['jack', 'karen'],
                    },
                    op: 'in',
                  },
                  {
                    content: {
                      field: 'lastName',
                      value: ['tremblay'],
                    },
                    op: 'in',
                  },
                ],
                op: 'or',
              },
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b605',
                content: [
                  {
                    content: {
                      field: 'firstName',
                      value: ['jack', 'karen'],
                    },
                    op: 'in',
                  },
                  {
                    content: {
                      field: 'lastName',
                      value: ['tremblay'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b601',
                content: [
                  {
                    content: {
                      field: 'firstName',
                      value: ['liam', 'karen'],
                    },
                    op: 'in',
                  },
                  {
                    content: {
                      field: 'progress',
                      value: ['50'],
                    },
                    op: '<',
                  },
                  {
                    content: {
                      field: 'visits',
                      value: ['1', '100'],
                    },
                    op: 'between',
                  },
                ],
                op: 'or',
              },
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b600',
                content: [
                  {
                    content: {
                      field: 'firstName',
                      value: ['henry', 'karen'],
                    },
                    op: 'in',
                  },
                  {
                    content: {
                      field: 'progress',
                      value: ['10'],
                    },
                    op: '>',
                  },
                  {
                    content: {
                      field: 'visits',
                      value: ['95'],
                    },
                    op: '<',
                  },
                  {
                    content: {
                      field: 'isActive',
                      value: ['true'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
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
    <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable
        id="storybook-query-builder"
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

export const CombinedQueries: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(mockListApi, httpMockListApiResponse),
        http.post(mockCountApi, httpMockCountApiResponse),
        http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse),
        http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
        http.get(userPreferenceApi, ({ params }: any) => {
          const key = params.key;
          if (key === 'data-table-storybook-query-builder') {
            return new HttpResponse(null, { status: 404 });
          }
          return HttpResponse.json({
            ...getDefaultQBContext(),
            activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b601',
            sqons: [
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b601',
                content: [
                  {
                    content: {
                      field: 'firstName',
                      value: ['jack', 'karen'],
                    },
                    op: 'in',
                  },
                  {
                    content: {
                      field: 'lastName',
                      value: ['tremblay'],
                    },
                    op: 'in',
                  },
                ],
                op: 'or',
              },
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b602',
                content: [
                  {
                    content: {
                      field: 'firstName',
                      value: ['jack', 'karen'],
                    },
                    op: 'in',
                  },
                  {
                    content: {
                      field: 'lastName',
                      value: ['tremblay'],
                    },
                    op: 'in',
                  },
                  {
                    content: {
                      field: 'progress',
                      value: ['50'],
                    },
                    op: '<',
                  },
                  {
                    content: {
                      field: 'visits',
                      value: ['1', '100'],
                    },
                    op: 'between',
                  },
                ],
                op: 'and',
              },
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
                content: [
                  {
                    content: {
                      field: 'firstName',
                      value: ['jack'],
                    },
                    op: 'in',
                  },
                ],
                op: 'or',
              },
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b604',
                content: [
                  {
                    content: {
                      field: 'lastName',
                      value: ['miller'],
                    },
                    op: 'in',
                  },
                ],
                op: 'or',
              },
            ],
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
    <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable
        id="storybook-query-builder"
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

export const SearchFacet: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(mockListApi, httpMockListApiResponse),
        http.post(mockCountApi, httpMockCountApiResponse),
        http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse),
        http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
        // Mock for gene autoComplete API
        http.get('*/genes/autocomplete', ({ request }) => {
          const url = new URL(request.url);
          const prefix = url.searchParams.get('prefix') || '';

          const genes = [
            { name: 'BRCA1', id: 'ENSG00000012048' },
            { name: 'BRCA2', id: 'ENSG00000139618' },
            { name: 'TP53', id: 'ENSG00000141510' },
          ];

          return HttpResponse.json(
            genes
              .filter(gene => gene.name.toLowerCase().includes(prefix.toLowerCase()))
              .map(gene => {
                const nameRegex = new RegExp(`(${prefix})`, 'gi');
                const highlightedName = gene.name.replace(nameRegex, '<strong>$1</strong>');

                return {
                  source: { name: gene.name, id: gene.id },
                  highlight: { name: highlightedName, id: gene.id },
                };
              }),
          );
        }),
        http.get(userPreferenceApi, ({ params }: any) => {
          const key = params.key;
          if (key === 'data-table-storybook-query-builder') {
            return new HttpResponse(null, { status: 404 });
          }
          return HttpResponse.json({
            ...getDefaultQBContext(),
            activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b603',
            sqons: [
              {
                id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
                content: [
                  {
                    content: {
                      field: 'gene_symbol',
                      value: ['BRCA1', 'TP53'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
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
      <div className="bold font-mono text-red">Existing genes in autocomplete: BRCA1, BRCA2, TP53</div>
      <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
        <QueryBuilderDataTable
          id="storybook-query-builder"
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
