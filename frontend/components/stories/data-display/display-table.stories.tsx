
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import DisplayTable from '@/components/base/data-table/display-table';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';
import { createColumnHelper } from '@tanstack/react-table';
import { CaseTask } from '@/api/api';
import { TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import DateCell from '@/components/base/data-table/cells/date-cell';
import BadgeListCell from '@/components/base/data-table/cells/badge-list-cell';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';

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

const columnHelper = createColumnHelper<CaseTask>()

const columns = [
  columnHelper.accessor('id', {
    cell: info => info.getValue(),
    header: 'Task ID',
    size: 100,
  }),
  columnHelper.accessor('type_code', {
    cell: info => <BadgeCell variant="secondary" tooltip={info.row.original.type_name}>{info.getValue()}</BadgeCell>,
    header: 'Type',
    size: 100,
  }),
  columnHelper.accessor('patients', {
    cell: info => <BadgeListCell variant="outline" badges={info.getValue()} />,
    header: "Patients",
    minSize: 148,
  }),
  columnHelper.accessor('created_on', {
    cell: info => <DateCell date={info.getValue()} />,
    header: () => (
      <TooltipsHeader tooltips="yyyy-mm-dd">Created On</TooltipsHeader>
    ),
    size: 80,
  }),
] as TableColumnDef<CaseTask, any>[];


const data = Array.from(Array(21).keys()).map((index) => (
  {
    "id": index,
    "type_code": "ngba",
    "type_name": "Normal Genome Bioinformatic Analysis",
    "created_on": "2021-10-12T13:08:00Z",
    "patients": ["father", "mother", "proband", "sibling"]
  })
)


const meta = {
  title: 'Data Display/Display Table',
  component: DisplayTable,
  args: {
    data,
    columns,
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


export const Empty: Story = {
  args: {
    data: [],
  },
  render: args => <DisplayTable {...args} />,
};


