// @ts-nocheck
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createColumnHelper } from '@tanstack/react-table';

import { SortBodyOrderEnum } from '@/api/api';
import TableFilters from '@/apps/case/src/exploration/table/case-exploration-table-filters';
import DataTable, { TableColumnDef } from '@/components/base/data-table/data-table';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

import { data, mockColumns, TableMockData, mockDefaultColumnSettings } from './table-mock';

const columnHelper = createColumnHelper<TableMockData>();

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
  title: 'Tables/Data Table',
  component: DataTable,
  args: {
    id: 'storybook',
    columns: mockColumns,
    data,
    serverOptions: {
      defaultSorting: [
        {
          field: 'pf_wgs',
          order: SortBodyOrderEnum.Asc,
        },
      ],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSortingChange: sorting => { },
    },
    defaultColumnSettings: mockDefaultColumnSettings,
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
      onPaginationChange: () => { },
    },
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
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};

export const Empty: Story = {
  args: {
    loadingStates: {
      list: false,
      total: false,
    },
    data: [],
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};

export const Error: Story = {
  args: {
    loadingStates: {
      list: false,
      total: false,
    },
    data: [],
    hasError: true,
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};

export const Default: Story = {
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};

export const Fullscreen: Story = {
  args: {
    enableFullscreen: true,
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <span>
            <i>Use &quot;Open in new canvas&quot; button at the top right of the screen a better preview</i>
          </span>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};

export const LessThan10Results: Story = {
  args: {
    data: data.slice(0, 1),
    total: 1,
    enableFullscreen: true,
    enableColumnOrdering: true,
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};

export const DataTableFiltersAndLessThan10Results: Story = {
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => { }} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom',
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};

export const PaginationHidden: Story = {
  args: {
    pagination: { type: 'hidden' },
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};

export const PaginationLocale: Story = {
  args: {
    pagination: { type: 'locale', state: { pageIndex: 0, pageSize: 5 } },
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};

export const GroupBy: Story = {
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [
      columnHelper.accessor('firstName', {
        id: 'firstName',
        cell: info => info.getValue(),
        header: () => <span>First Name</span>,
      }),
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
      }),
      columnHelper.accessor('age', {
        id: 'age',
        header: () => 'Age',
        cell: info => info.renderValue(),
        aggregatedCell: ({ getValue }) => <>{`[${getValue()[0]}-${getValue()[1]}]`}</>,
        aggregationFn: 'extent',
        enableGrouping: true,
      }),
      columnHelper.accessor('visits', {
        id: 'visits',
        header: () => <span>Visits</span>,
        aggregationFn: 'sum',
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        getGroupingValue: row => `Group By ${row.status}`,
        enableGrouping: true,
      }),
      columnHelper.accessor('progress', {
        id: 'progress',
        header: 'Profile Progress',
        cell: ({ getValue }) => `${Math.round(getValue<number>() * 100) / 100}%`,
        aggregationFn: 'mean',
        aggregatedCell: ({ getValue }) => `~${Math.round(getValue<number>() * 100) / 100}%`,
      }),
    ] as TableColumnDef<TableMockData, any>[],
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <span>
            You can group by <b>status</b>
          </span>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};

export const Footer: Story = {
  args: {
    columns: [
      columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        header: () => <span>First Name</span>,
        footer: () => <span>First Name</span>,
      }),
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
        footer: () => <span>Last Name</span>,
      }),
      columnHelper.accessor('age', {
        header: () => 'Age',
        cell: info => info.renderValue(),
        footer: () => <span>Age</span>,
      }),
      columnHelper.accessor('visits', {
        header: () => <span>Visits</span>,
        footer: () => <span>First Name</span>,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        footer: () => <span>Status</span>,
      }),
      columnHelper.accessor('progress', {
        header: 'Profile Progress',
        footer: () => <span>Profile Progress</span>,
      }),
    ],
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
  ),
};
