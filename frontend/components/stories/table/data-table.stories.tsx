// @ts-nocheck
import { useState } from 'react';
import { BrowserRouter } from 'react-router';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchIcon } from 'lucide-react';

import { SortBodyOrderEnum } from '@/api/api';
import TableFilters from '@/apps/case/src/exploration/table/case-exploration-table-filters';
import RowSelectionCell from '@/components/base/data-table/cells/row-selection-cell';
import { createAppColumnHelper, createColumnSettings } from '@/components/base/data-table/data-table';
import DataTable, { type TableColumnDef } from '@/components/base/data-table/data-table';
import TableSelectionSummary from '@/components/base/data-table/data-table-selection-summary';
import RowSelectionHeader from '@/components/base/data-table/headers/table-row-selection-header';
import EmptyState from '@/components/base/empties/empty';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { ApplicationId, ConfigProvider, type PortalConfig } from '@/components/cores/applications-config';

import { StorySection } from '../story-section';

import { data, mockColumns, mockDefaultColumnSettings, type TableMockData } from './table-mock';

const columnHelper = createAppColumnHelper<TableMockData>();

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  germline_snv_occurrence: {
    app_id: ApplicationId.germline_snv_occurrence,
    aggregations: [] as any,
  },
  germline_cnv_occurrence: {
    app_id: ApplicationId.germline_cnv_occurrence,
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
  title: 'Features/Data Table',
  component: DataTable,
  args: {
    id: 'storybook',
    columns: mockColumns,
    data,
    serverOptions: {
      defaultSorting: [
        {
          field: 'germline_pf_wgs',
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

// Shared full-page wrapper: every story renders the same DataTable scaffold,
// differing only by args / state.
function DataTableStory({ args, title, description }: { args: any; title: string; description?: string }) {
  return (
    <StorySection title={title} description={description}>
      <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
        <Card className="h-auto size-max w-full">
          <CardContent>
            <DataTable {...args} />
          </CardContent>
        </Card>
      </div>
    </StorySection>
  );
}

export const Loading: Story = {
  args: {
    loadingStates: {
      list: true,
      total: true,
    },
  },
  render: args => <DataTableStory args={args} title="Loading" />,
};

export const DefaultSorting: Story = {
  args: {
    data: [...data].sort((a, b) => b.age - a.age).slice(0, 10),
    serverOptions: {
      defaultSorting: [{ field: 'age', order: SortBodyOrderEnum.Desc }],
      onSortingChange: () => {},
    },
  },
  render: args => (
    <DataTableStory
      args={args}
      title="Default sorting"
      description="The sort icon shows on the default-sorted column on load, and comes back when another column's sort is cleared."
    />
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
  render: args => <DataTableStory args={args} title="Empty" />,
};

export const CustomEmptyState: Story = {
  args: {
    loadingStates: {
      list: false,
      total: false,
    },
    data: [],
    emptyState: (
      <EmptyState
        title="Custom empty state"
        description="Replaces the default empty state"
        iconType="custom"
        icon={SearchIcon}
        size="mini"
      >
        <Button size="sm" variant="outline">
          Action
        </Button>
      </EmptyState>
    ),
  },
  render: args => <DataTableStory args={args} title="Custom empty state" />,
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
  render: args => <DataTableStory args={args} title="Error" />,
};

export const Default: Story = {
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
  },
  render: args => <DataTableStory args={args} title="Default" />,
};

export const Fullscreen: Story = {
  args: {
    enableFullscreen: true,
  },
  render: args => (
    <DataTableStory
      args={args}
      title="Fullscreen"
      description="Use the “Open in new canvas” button at the top right of the screen for a better preview."
    />
  ),
};

export const LessThan10Results: Story = {
  args: {
    data: data.slice(0, 1),
    total: 1,
    enableFullscreen: true,
    enableColumnOrdering: true,
  },
  render: args => <DataTableStory args={args} title="Less than 10 results" />,
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
  render: args => <DataTableStory args={args} title="Filters + less than 10 results" />,
};

export const PaginationHidden: Story = {
  args: {
    pagination: { type: 'hidden' },
  },
  render: args => <DataTableStory args={args} title="Pagination hidden" />,
};

export const PaginationLocale: Story = {
  args: {
    pagination: { type: 'locale', state: { pageIndex: 0, pageSize: 5 } },
  },
  render: args => <DataTableStory args={args} title="Pagination locale" />,
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
  render: args => <DataTableStory args={args} title="Group by" description="You can group by status." />,
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
  render: args => <DataTableStory args={args} title="Footer" />,
};

const selectionColumn = {
  id: 'rowSelection',
  size: 48,
  maxSize: 48,
  enableResizing: false,
  header: ({ table }) => <RowSelectionHeader table={table} />,
  cell: ({ row }) => <RowSelectionCell row={row} />,
};

function SelectableDataTableStory({ args }: { args: any }) {
  const [rowSelection, setRowSelection] = useState({});
  const selectedCount = Object.keys(rowSelection).length;

  return (
    <DataTableStory
      title="Toolbar actions and selection summary"
      description="`toolbarActions` renders left of the table settings; `selectionSummary` replaces the results index while rows are selected."
      args={{
        ...args,
        rowSelection,
        onRowSelectionChange: setRowSelection,
        toolbarActions:
          selectedCount === 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable so keyboard users can open the tooltip */}
                <span tabIndex={0}>
                  <Button size="sm" disabled>
                    Download report
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Select at least one item</TooltipContent>
            </Tooltip>
          ) : (
            <Button size="sm">Download report</Button>
          ),
        selectionSummary: selectedCount > 0 ? <TableSelectionSummary count={selectedCount} /> : undefined,
      }}
    />
  );
}

export const ToolbarActionsAndSelectionSummary: Story = {
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [selectionColumn, ...mockColumns],
    defaultColumnSettings: createColumnSettings([
      { id: 'rowSelection', visible: true, fixed: true, pinningPosition: 'left' },
      ...mockDefaultColumnSettings,
    ]),
    getRowId: (row: TableMockData) => `${row.firstName}-${row.lastName}`,
  },
  render: args => <SelectableDataTableStory args={args} />,
};
