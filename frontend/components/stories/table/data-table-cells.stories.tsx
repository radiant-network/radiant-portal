// @ts-nocheck
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';

import { SortBodyOrderEnum } from '@/api/api';
import DataTable, { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';

import {
  applicationCellData,
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
  title: 'Tables/Data Table/Cells',
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
    onPaginationChange: () => {},
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
      data={applicationCellData}
      defaultColumnSettings={defaultColumnSettings}
    />
  ),
};
