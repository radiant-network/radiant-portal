/* eslint-disable no-use-before-define */
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import axios from 'axios';
import { delay, http, HttpResponse } from 'msw';
import { mocked } from 'storybook/test';

import { SavedFilterType } from '@/api/index';
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
    saved_filter_type: SavedFilterType.GERMLINE_SNV_VARIANT,
  },
  germline_snv_occurrence: {
    app_id: ApplicationId.germline_snv_occurrence,
    saved_filter_type: SavedFilterType.GERMLINE_SNV_OCCURRENCE,
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
            key: 'search_by_symbol',
            translation_key: 'search_by_symbol',
            type: FilterTypes.SEARCH_BY,
          },
          {
            key: 'upload_list_symbol',
            translation_key: 'upload',
            type: FilterTypes.UPLOAD_LIST,
          },
        ],
      },
    },
  },
  germline_cnv_occurrence: {
    app_id: ApplicationId.germline_cnv_occurrence,
    saved_filter_type: SavedFilterType.GERMLINE_CNV_OCCURRENCE,
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
    saved_filter_type: SavedFilterType.GERMLINE_SNV_OCCURRENCE,
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
    appId: ApplicationId.germline_snv_occurrence,
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
    appId: ApplicationId.germline_cnv_occurrence,
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
    appId: ApplicationId.germline_snv_occurrence,
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
    appId: ApplicationId.germline_snv_occurrence,
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
    appId: ApplicationId.germline_snv_occurrence,
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
    appId: ApplicationId.germline_snv_occurrence,
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
    appId: ApplicationId.germline_snv_occurrence,
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
    appId: ApplicationId.germline_snv_occurrence,
    children: <></>, // unused
    defaultSidebarOpen: true,
  },
  render: args => (
    <>
      <div className="flex flex-col gap-2 p-4 mb-4 bg-muted rounded-lg">
        <div className="font-mono text-sm">
          <strong>Test genes available:</strong> BRCA1, BRCA2, TP53.
        </div>
      </div>
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

export const UploadIdModal: Story = {
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
        // Mock for gene search API (used by upload modal)
        http.post('*/genes/search', async ({ request }) => {
          try {
            const body = (await request.json()) as any;
            const inputs = body.inputs || [];

            const geneDatabase = [
              { symbol: 'BRCA1', ensembl_gene_id: 'ENSG00000012048' },
              { symbol: 'BRCA2', ensembl_gene_id: 'ENSG00000139618' },
              { symbol: 'TP53', ensembl_gene_id: 'ENSG00000141510' },
              { symbol: 'EGFR', ensembl_gene_id: 'ENSG00000146648' },
              { symbol: 'PTEN', ensembl_gene_id: 'ENSG00000171862' },
              { symbol: 'MYC', ensembl_gene_id: 'ENSG00000136997' },
              { symbol: 'KRAS', ensembl_gene_id: 'ENSG00000133703' },
            ];

            const results = geneDatabase.filter(gene =>
              inputs.some(
                (input: string) =>
                  gene.symbol.toLowerCase() === input.toLowerCase() ||
                  gene.ensembl_gene_id.toLowerCase() === input.toLowerCase(),
              ),
            );

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            return HttpResponse.json(results);
          } catch (error) {
            console.error('🧬 Gene search error:', error);
            return HttpResponse.json([], { status: 500 });
          }
        }),
        http.get(userPreferenceApi, () => new HttpResponse(null, { status: 404 })),
      ],
    },
  },
  args: {
    appId: ApplicationId.germline_snv_occurrence,
    children: <></>, // unused
    defaultSidebarOpen: true,
  },
  render: args => (
    <>
      <div className="flex flex-col gap-2 p-4 mb-4 bg-muted rounded-lg">
        <div className="font-mono text-sm">
          <strong>Test genes available:</strong> BRCA1, BRCA2, TP53, EGFR, PTEN, MYC, KRAS.
        </div>
        <div className="text-sm text-muted-foreground">
          Try uploading a text file with gene names/IDs or paste them in the textarea.
        </div>
      </div>
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

export const SavedFilters: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(mockListApi, httpMockListApiResponse),
        http.post(mockCountApi, httpMockCountApiResponse),
        http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse),
        http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
        // Mock saved filters API
        http.get('*/users/saved_filters', ({ request }) => {
          const url = new URL(request.url);
          const type = url.searchParams.get('type');

          // Mock saved filters data
          const mockSavedFilters = [
            {
              id: 'filter-1',
              name: 'Active Patients Filter',
              type: type,
              favorite: false,
              user_id: 'user-123',
              created_on: '2024-01-15T10:00:00Z',
              updated_on: '2024-01-15T10:00:00Z',
              queries: [
                {
                  id: 'query-1',
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
            },
            {
              id: 'filter-2',
              name: 'High Progress Filter',
              type: type,
              favorite: false,
              user_id: 'user-123',
              created_on: '2024-01-10T14:30:00Z',
              updated_on: '2024-01-12T16:45:00Z',
              queries: [
                {
                  id: 'query-2',
                  content: [
                    {
                      content: {
                        field: 'progress',
                        value: ['75'],
                      },
                      op: '>',
                    },
                  ],
                  op: 'and',
                },
              ],
            },
            {
              id: 'filter-3',
              name: 'Complex Multi-Query Filter',
              type: type,
              favorite: false,
              user_id: 'user-123',
              created_on: '2024-01-05T09:15:00Z',
              updated_on: '2024-01-08T11:20:00Z',
              queries: [
                {
                  id: 'query-3a',
                  content: [
                    {
                      content: {
                        field: 'firstName',
                        value: ['henry', 'liam'],
                      },
                      op: 'in',
                    },
                  ],
                  op: 'or',
                },
                {
                  id: 'query-3b',
                  content: [
                    {
                      content: {
                        field: 'visits',
                        value: ['50', '200'],
                      },
                      op: 'between',
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
            },
            {
              id: 'filter-4',
              name: 'Test Filter for Deletion',
              type: type,
              favorite: false,
              user_id: 'user-123',
              created_on: '2024-01-01T12:00:00Z',
              updated_on: '2024-01-01T12:00:00Z',
              queries: [
                {
                  id: 'query-4',
                  content: [
                    {
                      content: {
                        field: 'lastName',
                        value: ['smith'],
                      },
                      op: 'in',
                    },
                  ],
                  op: 'and',
                },
              ],
            },
            {
              id: 'filter-5',
              name: 'Simple Filter',
              type: type,
              favorite: false,
              user_id: 'user-123',
              created_on: '2024-01-01T12:00:00Z',
              updated_on: '2024-01-01T12:00:00Z',
              queries: [
                {
                  id: 'query-5',
                  content: [
                    {
                      content: {
                        field: 'firstName',
                        value: ['alice'],
                      },
                      op: 'in',
                    },
                  ],
                  op: 'and',
                },
              ],
            },
            {
              id: 'filter-6',
              name: 'Duplicate Test COPY',
              type: type,
              favorite: false,
              user_id: 'user-123',
              created_on: '2024-01-02T12:00:00Z',
              updated_on: '2024-01-02T12:00:00Z',
              queries: [
                {
                  id: 'query-6',
                  content: [
                    {
                      content: {
                        field: 'firstName',
                        value: ['bob'],
                      },
                      op: 'in',
                    },
                  ],
                  op: 'and',
                },
              ],
            },
            {
              id: 'filter-7',
              name: 'Duplicate Test',
              type: type,
              favorite: true,
              user_id: 'user-123',
              created_on: '2024-01-03T12:00:00Z',
              updated_on: '2024-01-03T12:00:00Z',
              queries: [
                {
                  id: 'query-7',
                  content: [
                    {
                      content: {
                        field: 'firstName',
                        value: ['charlie'],
                      },
                      op: 'in',
                    },
                  ],
                  op: 'and',
                },
              ],
            },
            {
              id: 'filter-8',
              name: 'Duplicate Test COPY 1',
              type: type,
              favorite: false,
              user_id: 'user-123',
              created_on: '2024-01-04T12:00:00Z',
              updated_on: '2024-01-04T12:00:00Z',
              queries: [
                {
                  id: 'query-8',
                  content: [
                    {
                      content: {
                        field: 'firstName',
                        value: ['david'],
                      },
                      op: 'in',
                    },
                  ],
                  op: 'and',
                },
              ],
            },
          ];

          return HttpResponse.json(mockSavedFilters);
        }),
        // Mock saved filter creation
        http.post('*/users/saved_filters', async ({ request }) => {
          const body = (await request.json()) as any;
          const newFilter = {
            id: `filter-${Date.now()}`,
            name: body.name,
            type: body.type,
            favorite: false,
            user_id: 'user-123',
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString(),
            queries: body.queries,
          };
          return HttpResponse.json(newFilter);
        }),
        // Mock saved filter update
        http.put('*/users/saved_filters/:id', async ({ request, params }) => {
          const body = (await request.json()) as any;
          const updatedFilter = {
            id: params.id,
            name: body.name,
            type: body.type,
            favorite: body.favorite ?? false,
            user_id: 'user-123',
            created_on: '2024-01-15T10:00:00Z',
            updated_on: new Date().toISOString(),
            queries: body.queries,
          };
          return HttpResponse.json(updatedFilter);
        }),
        // Mock saved filter deletion
        http.delete(
          '*/users/saved_filters/:id',
          async () =>
            // Simulate successful deletion
            new HttpResponse(null, { status: 204 }),
        ),
        // Mock user preferences for query builder state (with unsaved changes)
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
                  // This additional filter creates "unsaved changes" compared to the saved filter
                  {
                    content: {
                      field: 'firstName',
                      value: ['jack', 'karen'],
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
