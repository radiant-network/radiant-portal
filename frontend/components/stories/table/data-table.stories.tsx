// @ts-nocheck
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';

import { SortBodyOrderEnum } from '@/api/api';
import TableFilters from '@/apps/case-exploration/src/components/table-filters/case-exploration-table-filters';
import DataTable, { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/model/applications-config';

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
  title: 'Tables/Data Table',
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
  },
  render: args => <DataTable {...args} />,
};

export const Empty: Story = {
  args: {
    loadingStates: {
      list: false,
      total: false,
    },
    data: [],
  },
  render: args => <DataTable {...args} />,
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
  render: args => <DataTable {...args} />,
};

export const Default: Story = {
  args: {
    data: data,
    enableFullscreen: true,
    enableColumnOrdering: true,
  },
  render: args => <DataTable {...args} />,
};

export const DefaultTableFilters: Story = {
  args: {
    loadingStates: {
      list: false,
      total: false,
    },
    data,
    enableColumnOrdering: false,
    enableFullscreen: true,
    tableIndexResultPosition: 'hidden',
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />,
  },
  render: args => <DataTable {...args} />,
};

export const Fullscreen: Story = {
  args: {
    enableFullscreen: true,
  },
  render: args => (
    <div>
      <span>
        <i>Use &quot;Open in new canvas&quot; button at the top right of the screen a better preview</i>
      </span>
      <DataTable {...args} />
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
  render: args => <DataTable {...args} />,
};

export const DataTableFiltersAndLessThan10Results: Story = {
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom',
  },
  render: args => <DataTable {...args} />,
};

export const PaginationHidden: Story = {
  args: {
    pagination: { type: 'hidden' },
  },
  render: args => <DataTable {...args} />,
};

export const GroupBy: Story = {
  args: {
    data: data,
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
    ] as TableColumnDef<MockData, any>[],
  },
  render: args => (
    <>
      <span>
        You can group by <b>status</b>
      </span>
      <DataTable {...args} />
    </>
  ),
};

export const HeaderGroups: Story = {
  args: {
    data: data,
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [
      columnHelper.group({
        id: 'group_1',
        header: () => <span>Group 1</span>,
        columns: [
          columnHelper.accessor('firstName', {
            cell: info => info.getValue(),
            footer: props => props.column.id,
          }),
          columnHelper.accessor(row => row.lastName, {
            id: 'lastName',
            cell: info => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: props => props.column.id,
          }),
        ],
      }),
      columnHelper.group({
        header: 'group_2',
        columns: [
          columnHelper.accessor('age', {
            header: () => 'Age',
            footer: props => props.column.id,
          }),
          columnHelper.group({
            header: 'More Info',
            columns: [
              columnHelper.accessor('visits', {
                header: () => <span>Visits</span>,
              }),
              columnHelper.accessor('status', {
                header: 'Status',
              }),
              columnHelper.accessor('progress', {
                header: 'Profile Progress',
              }),
            ],
          }),
        ],
      }),
    ] as TableColumnDef<MockData, any>[],
  },
  render: args => <DataTable {...args} />,
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
  render: args => <DataTable {...args} />,
};
