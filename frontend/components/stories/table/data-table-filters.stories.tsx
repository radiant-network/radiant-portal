// @ts-nocheck
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { http } from 'msw';

import { SortBodyOrderEnum } from '@/api/api';
import TableFilters from '@/apps/case-exploration/src/components/table-filters/case-exploration-table-filters';
import DataTable, { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/model/applications-config';

import {
  caseAutocomplete,
  caseFiltersApi,
  caseSearchApi,
  httpCaseAutocompleteResponse,
  httpCaseFiltersApiResponse,
  httpCaseSearchApiResponse,
} from '../api/api-case';

import { data, MockData } from './table-mock';

const columnHelper = createColumnHelper<MockData>();

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  snv_occurrence: {
    app_id: ApplicationId.snv_occurrence,
    aggregations: [] as any,
  },
  cnv_occurrence: {
    app_id: ApplicationId.cnv_occurrence,
    aggregations: [] as any,
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
  title: 'Tables/Data Table/Filters',
  component: DataTable,
  args: {
    id: 'storybook',
    columns: [
      columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        header: () => <span>First Name</span>,
      }),
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
      }),
      columnHelper.accessor('age', {
        header: () => 'Age',
        cell: info => info.renderValue(),
      }),
      columnHelper.accessor('visits', {
        header: () => <span>Visits</span>,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
      }),
      columnHelper.accessor('progress', {
        header: 'Profile Progress',
      }),
    ] as TableColumnDef<MockData, any>[],
    data,
    defaultServerSorting: [
      {
        field: 'pf_wgs',
        order: SortBodyOrderEnum.Asc,
      },
    ],
    defaultColumnSettings: createColumnSettings([
      {
        id: 'firstName',
        visible: true,
        label: 'First Name',
      },
      {
        id: 'lastName',
        visible: true,
        label: 'Last Name',
      },
      {
        id: 'age',
        visible: true,
        label: 'Age',
      },
      {
        id: 'visits',
        visible: true,
        label: 'firstName',
      },
      {
        id: 'status',
        visible: true,
        label: 'Status',
      },
      {
        id: 'progress',
        visible: true,
        label: 'Profile Progress',
      },
    ]),
    loadingStates: {
      total: false,
      list: false,
    },
    pagination: {
      type: 'server',
      state: {
        pageIndex: 0,
        pageSize: 10,
      },
      onPaginationChange: () => {},
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onServerSortingChange: sorting => {},
    total: 10,
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <ConfigProvider config={config}>
          <Story />
        </ConfigProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof DataTable<any>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    loadingStates: {
      list: true,
      total: true,
    },
    enableColumnOrdering: false,
    enableFullscreen: true,
    tableIndexResultPosition: 'hidden',
    TableFilters: <TableFilters loading={true} setSearchCriteria={() => {}} />,
  },
  render: args => <DataTable {...args} />,
};

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(caseSearchApi, httpCaseSearchApiResponse),
        http.post(caseFiltersApi, httpCaseFiltersApiResponse),
        http.get(caseAutocomplete, httpCaseAutocompleteResponse),
      ],
    },
  },
  args: {
    loadingStates: {
      list: false,
      total: false,
    },
    data,
    enableColumnOrdering: false,
    enableFullscreen: true,
    tableIndexResultPosition: 'hidden',
    TableFilters: <TableFilters loading={false} setSearchCriteria={() => {}} />,
  },
  render: args => <DataTable {...args} />,
};
