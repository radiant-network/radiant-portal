import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { http } from 'msw';

import DataTable from '@/components/base/data-table/data-table';
import QueryBuilder from '@/components/base/query-builder-v3/query-builder';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { ApplicationId, ConfigProvider, FilterTypes, PortalConfig } from '@/components/cores/applications-config';
import { RangeOperators } from '@/components/cores/sqon';

import {
  httpOccurrenceApiResponse,
  httpStatisticsApiResponse,
  occurrenceApi,
  statisticApi,
} from '../api/api-occurrence';

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
            key: 'toggle filter',
            translation_key: 'toggle filter',
            type: FilterTypes.BOOLEAN,
          },
        ],
      },
    },
  },
  cnv_occurrence: {
    app_id: ApplicationId.cnv_occurrence,
    aggregations: {},
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
  render: () => (
    <QueryBuilder appId={ApplicationId.snv_occurrence} defaultSidebarOpen>
      <Card>
        <CardContent>
          <DataTable
            id="storybook-query-builder"
            columns={[]}
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
  ),
};
