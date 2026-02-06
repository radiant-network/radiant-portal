// @ts-nocheck
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createColumnHelper } from '@tanstack/react-table';

import { SortBodyOrderEnum } from '@/api/api';
import DataTable, { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

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
import { data, TableMockData } from './table-mock';

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
    ] as TableColumnDef<TableMockData, any>[],
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
      onPaginationChange: () => { },
    },
    total: 10,
  },
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/case/entity/1']}>
        <Routes>
          <Route
            path="/case/entity/:caseId"
            element={
              <ConfigProvider config={config}>
                <Story />
              </ConfigProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof DataTable<any>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BaseCell: Story = {
  args: {
    pagination: { type: 'hidden' },
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
    pagination: { type: 'hidden' },
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
