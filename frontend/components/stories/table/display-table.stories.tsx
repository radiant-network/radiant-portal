import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createColumnHelper } from '@tanstack/react-table';

import { TableColumnDef } from '@/components/base/data-table/data-table';
import DisplayTable from '@/components/base/data-table/display-table';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';

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
  title: 'Tables/Display Table',
  component: DisplayTable,
  args: {
    data,
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
} satisfies Meta<typeof DisplayTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => <DisplayTable {...args} />,
};

export const Borderless: Story = {
  args: {
    variant: 'borderless',
  },
  render: args => <DisplayTable {...args} />,
};

export const Border: Story = {
  args: {
    variant: 'border',
  },
  render: args => <DisplayTable {...args} />,
};

export const WithHeaderGroups: Story = {
  args: {
    variant: 'border',
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
    ] as TableColumnDef<TableMockData, any>[],
  },
  render: args => <DisplayTable {...args} />,
};

export const Empty: Story = {
  args: {
    data: [],
  },
  render: args => <DisplayTable {...args} />,
};
