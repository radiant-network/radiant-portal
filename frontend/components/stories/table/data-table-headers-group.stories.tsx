// @ts-nocheck
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';

import { SortBodyOrderEnum } from '@/api/api';
import PinRowCell from '@/components/base/data-table/cells/pin-row-cell';
import RowSelectionCell from '@/components/base/data-table/cells/row-selection-cell';
import DataTable, { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import RowSelectionHeader from '@/components/base/data-table/headers/table-row-selection-header';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

import { advancedData, AdvancedMockData, data, mockColumns, MockData, mockDefaultColumnSettings } from './table-mock';

const columnHelper = createColumnHelper<MockData>();

const defaultMockColumnSettings = createColumnSettings([
  {
    id: 'pinRow',
    visible: true,
    label: 'Pin Row',
    fixed: true,
  },
  {
    id: 'rowSelection',
    visible: true,
    label: 'Row Selection',
    fixed: true,
  },
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
]);

const defaultAdvancedColumnSettings = createColumnSettings([
  {
    id: 'pinRow',
    visible: true,
    label: 'Pin Row',
    fixed: true,
  },
  {
    id: 'rowSelection',
    visible: true,
    label: 'Row Selection',
    fixed: true,
  },
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
    id: 'email',
    visible: true,
    label: 'Email',
  },
  {
    id: 'phoneNumber',
    visible: true,
    label: 'Phone Number',
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
  {
    id: 'hobbies',
    visible: false,
    label: 'Hobbies',
  },
  {
    id: 'country',
    visible: true,
    label: 'Country',
  },
  {
    id: 'city',
    visible: true,
    label: 'City',
  },
  {
    id: 'accountCreatedAt',
    visible: true,
    label: 'Account Created At',
  },
  {
    id: 'lastLoginAt',
    visible: true,
    label: 'Last Login At',
  },
  {
    id: 'isActive',
    visible: true,
    label: 'Is Active',
  },
  {
    id: 'role',
    visible: true,
    label: 'Role',
  },
  {
    id: 'lastVisitAt',
    visible: true,
    label: 'Last Visit At',
  },
  {
    id: 'preferredLanguage',
    visible: true,
    label: 'Preferred Language',
  },
  {
    id: 'newsletterSubscribed',
    visible: true,
    label: 'Newsletter Subscribed',
  },
  {
    id: 'themePreference',
    visible: true,
    label: 'Theme Preference',
  },
  {
    id: 'tags',
    visible: false,
    label: 'Tags',
  },
  {
    id: 'notes',
    visible: false,
    label: 'Notes',
  },
]);

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
  title: 'Tables/Data Table/HeadersGroup',
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
      onSortingChange: sorting => {},
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
      onPaginationChange: () => {},
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

export const Default: Story = {
  args: {
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [
      {
        header: 'Group Left',
        size: 400,
        minSize: 200,
        columns: [
          {
            id: 'pinRow',
            cell: PinRowCell,
            enableResizing: false,
            enablePinning: false,
          },
          {
            id: 'rowSelection',
            header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
            cell: info => <RowSelectionCell row={info.row} />,
            enableResizing: false,
            enablePinning: false,
          },
          columnHelper.accessor('firstName', {
            cell: info => info.getValue(),
          }),
          columnHelper.accessor('lastName', {
            id: 'lastName',
            cell: info => info.getValue(),
            header: 'Last Name',
          }),
        ],
      },
      {
        header: 'Group Right',
        size: 400,
        minSize: 200,
        columns: [
          columnHelper.accessor('age', {
            header: () => 'Age',
          }),
          columnHelper.accessor('visits', {
            header: 'Visits',
          }),
          columnHelper.accessor('status', {
            header: 'Status',
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
          }),
        ],
      },
    ] as TableColumnDef<MockData, any>[],
    defaultColumnSettings: defaultMockColumnSettings,
  },
  render: args => (
    <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <div className="bg-background pt-4">
            <DataTable {...args} />
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

export const WithSubgroups: Story = {
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [
      {
        header: 'Group Left',
        columns: [
          columnHelper.group({
            id: 'sub-group-left',
            columns: [
              {
                id: 'pinRow',
                cell: PinRowCell,
                enableResizing: false,
                enablePinning: false,
              },
              {
                id: 'rowSelection',
                header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
                cell: info => <RowSelectionCell row={info.row} />,
                enableResizing: false,
                enablePinning: false,
              },
              columnHelper.accessor('firstName', {
                cell: info => info.getValue(),
              }),
              columnHelper.accessor('lastName', {
                id: 'lastName',
                cell: info => info.getValue(),
                header: 'Last Name',
              }),
            ],
          }),
        ],
      },
      {
        header: 'Group Right',
        columns: [
          columnHelper.group({
            header: 'Sub Group',
            columns: [
              columnHelper.accessor('age', {
                header: () => 'Age',
              }),
              columnHelper.accessor('visits', {
                header: 'Visits',
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
      },
    ] as TableColumnDef<MockData, any>[],
    defaultColumnSettings: defaultMockColumnSettings,
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

export const Advanced: Story = {
  args: {
    data: advancedData.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [
      // group actions
      {
        id: 'actions',
        size: 100,
        columns: [
          columnHelper.group({
            id: 'sub-group-user',
            columns: [
              {
                id: 'pinRow',
                cell: PinRowCell,
                size: 48,
                enableResizing: false,
                enablePinning: false,
              },
              {
                id: 'rowSelection',
                header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
                cell: info => <RowSelectionCell row={info.row} />,
                size: 48,
                enableResizing: false,
                enablePinning: false,
              },
            ],
          }),
        ],
      },
      // group user
      {
        header: 'User',
        columns: [
          columnHelper.group({
            header: 'Name',
            columns: [
              columnHelper.accessor('firstName', {
                cell: info => info.getValue(),
              }),
              columnHelper.accessor('lastName', {
                id: 'lastName',
                cell: info => info.getValue(),
                header: 'Last Name',
              }),
            ],
          }),
          columnHelper.accessor('email', {
            header: 'Email',
          }),
          columnHelper.accessor('phoneNumber', {
            header: 'Phone Number',
          }),
        ],
      },
      // group statistics
      {
        header: 'Statistics',
        columns: [
          columnHelper.group({
            id: 'subgroup-statistics',
            columns: [
              columnHelper.accessor('age', {
                header: 'Age',
              }),
              columnHelper.accessor('visits', {
                header: 'Visits',
              }),
              columnHelper.accessor('status', {
                header: 'Status',
              }),
              columnHelper.accessor('progress', {
                header: 'Profile Progress',
              }),
              columnHelper.accessor('hobbies', {
                header: 'Hobbies',
              }),
            ],
          }),
        ],
      },
      // group location
      {
        header: 'Location',
        columns: [
          columnHelper.group({
            id: 'subgroup-location',
            columns: [
              columnHelper.accessor('country', {
                header: 'Country',
              }),
              columnHelper.accessor('city', {
                header: 'City',
              }),
            ],
          }),
        ],
      },
      // group account
      {
        header: 'Account',
        columns: [
          columnHelper.group({
            id: 'sub-group-account',
            columns: [
              columnHelper.accessor('isActive', {
                header: 'Is Active',
              }),
              columnHelper.accessor('role', {
                header: 'Role',
              }),
              columnHelper.accessor('preferredLanguage', {
                header: 'Preferred Language',
              }),
              columnHelper.accessor('newsletterSubscribed', {
                header: 'Newsletter Subscribed',
              }),
              columnHelper.accessor('themePreference', {
                header: 'Theme Preference',
              }),
              columnHelper.accessor('accountCreatedAt', {
                header: 'Account Created At',
              }),
              columnHelper.accessor('lastLoginAt', {
                header: 'Last Login At',
              }),
              columnHelper.accessor('lastVisitAt', {
                header: 'Last Visited At',
              }),
            ],
          }),
        ],
      },
      // group additionals
      {
        header: 'Additionals',
        columns: [
          columnHelper.group({
            id: 'sub-group-additionals',
            columns: [
              columnHelper.accessor('tags', {
                header: 'Tags',
              }),
              columnHelper.accessor('notes', {
                header: 'Notes',
              }),
            ],
          }),
        ],
      },
    ] as TableColumnDef<AdvancedMockData, any>[],
    defaultColumnSettings: defaultAdvancedColumnSettings,
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

export const AdvancedWith50users: Story = {
  args: {
    data: advancedData,
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [
      // group actions
      {
        id: 'actions',
        size: 100,
        columns: [
          columnHelper.group({
            id: 'sub-group-user',
            columns: [
              {
                id: 'pinRow',
                cell: PinRowCell,
                size: 48,
                enableResizing: false,
                enablePinning: false,
              },
              {
                id: 'rowSelection',
                header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
                cell: info => <RowSelectionCell row={info.row} />,
                size: 48,
                enableResizing: false,
                enablePinning: false,
              },
            ],
          }),
        ],
      },
      // group user
      {
        header: 'User',
        columns: [
          columnHelper.group({
            header: 'Name',
            columns: [
              columnHelper.accessor('firstName', {
                cell: info => info.getValue(),
              }),
              columnHelper.accessor('lastName', {
                id: 'lastName',
                cell: info => info.getValue(),
                header: 'Last Name',
              }),
            ],
          }),
          columnHelper.accessor('email', {
            header: 'Email',
          }),
          columnHelper.accessor('phoneNumber', {
            header: 'Phone Number',
          }),
        ],
      },
      // group statistics
      {
        header: 'Statistics',
        columns: [
          columnHelper.group({
            id: 'subgroup-statistics',
            columns: [
              columnHelper.accessor('age', {
                header: 'Age',
              }),
              columnHelper.accessor('visits', {
                header: 'Visits',
              }),
              columnHelper.accessor('status', {
                header: 'Status',
              }),
              columnHelper.accessor('progress', {
                header: 'Profile Progress',
              }),
              columnHelper.accessor('hobbies', {
                header: 'Hobbies',
              }),
            ],
          }),
        ],
      },
      // group location
      {
        header: 'Location',
        columns: [
          columnHelper.group({
            id: 'subgroup-location',
            columns: [
              columnHelper.accessor('country', {
                header: 'Country',
              }),
              columnHelper.accessor('city', {
                header: 'City',
              }),
            ],
          }),
        ],
      },
      // group account
      {
        header: 'Account',
        columns: [
          columnHelper.group({
            id: 'sub-group-account',
            columns: [
              columnHelper.accessor('isActive', {
                header: 'Is Active',
              }),
              columnHelper.accessor('role', {
                header: 'Role',
              }),
              columnHelper.accessor('preferredLanguage', {
                header: 'Preferred Language',
              }),
              columnHelper.accessor('newsletterSubscribed', {
                header: 'Newsletter Subscribed',
              }),
              columnHelper.accessor('themePreference', {
                header: 'Theme Preference',
              }),
              columnHelper.accessor('accountCreatedAt', {
                header: 'Account Created At',
              }),
              columnHelper.accessor('lastLoginAt', {
                header: 'Last Login At',
              }),
              columnHelper.accessor('lastVisitAt', {
                header: 'Last Visited At',
              }),
            ],
          }),
        ],
      },
      // group additionals
      {
        header: 'Additionals',
        columns: [
          columnHelper.group({
            id: 'sub-group-additionals',
            columns: [
              columnHelper.accessor('tags', {
                header: 'Tags',
              }),
              columnHelper.accessor('notes', {
                header: 'Notes',
              }),
            ],
          }),
        ],
      },
    ] as TableColumnDef<AdvancedMockData, any>[],
    defaultColumnSettings: defaultAdvancedColumnSettings,
    loadingStates: {
      total: false,
      list: false,
    },
    pagination: {
      type: 'server',
      state: {
        pageIndex: 0,
        pageSize: 50,
      },
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
