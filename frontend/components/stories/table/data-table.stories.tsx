// @ts-nocheck
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';

import { SortBodyOrderEnum } from '@/api/api';
import TableFilters from '@/apps/case-exploration/src/components/table-filters/table-filters';
import DataTable, { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';

import {
  applicationFirstSetCellColumns,
  defaultColumnSettings,
  firstSetCellColumns,
  firstSetCellData,
  secondSetCellColumns,
  secondSetCellData,
  thirdSetCellColumns,
  thirdSetCellData,
} from './cells-mock';
import { data, MockData } from './table-mock';

const columnHelper = createColumnHelper<MockData>();

const config: PortalConfig = {
  variant_entity: {
    app_id: 'variant_entity',
  },
  variant_exploration: {
    app_id: 'variant_exploration_multi_select_filter',
    aggregations: [] as any,
  },
  admin: {
    admin_code: 'admin',
    app_id: 'admin',
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
      pageIndex: 0,
      pageSize: 10,
    },
    onPaginationChange: () => { },
    onServerSortingChange: sorting => { },
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
    data: data.slice(0, 10),
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
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => { }} />,
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

export const TableFiltersAndLessThan10Results: Story = {
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => { }} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom',
  },
  render: args => <DataTable {...args} />,
};

export const HeaderGroups: Story = {
  args: {
    data: data.slice(0, 10),
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

export const PaginationHidden: Story = {
  args: {
    paginationHidden: true,
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

export const BaseCell: Story = {
  args: {
    paginationHidden: true,
  },
  render: args => (
    <>
      <DataTable
        {...args}
        columns={firstSetCellColumns}
        data={firstSetCellData}
        defaultColumnSettings={defaultColumnSettings}
      />
      <DataTable
        {...args}
        columns={secondSetCellColumns}
        data={secondSetCellData}
        defaultColumnSettings={defaultColumnSettings}
      />
      <DataTable
        {...args}
        columns={thirdSetCellColumns}
        data={thirdSetCellData}
        defaultColumnSettings={defaultColumnSettings}
      />
    </>
  ),
};

export const ApplicationFeatureCell: Story = {
  args: {
    paginationHidden: true,
  },
  render: args => (
    <DataTable
      {...args}
      columns={applicationFirstSetCellColumns}
      data={secondSetCellColumns}
      defaultColumnSettings={defaultColumnSettings}
    />
  ),
};
