import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import DataTable from '@/components/base/data-table/data-table';
import { SortBodyOrderEnum } from '@/api/api';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';
import occurrencesData from './mocks/table-occurences-mock';
import casesData from './mocks/table-cases-mock';

import {
  getVariantColumns,
  defaultSettings as occurenceDefaultsSettings,
} from '../../../apps/case-entity/src/components/variants/occurrence-table/table-settings';
import {
  getCaseExplorationColumns,
  defaultSettings as caseDefaultsSettings,
} from '../../../apps/case-exploration/src/feature/case-table/table-settings';
import OccurrenceExpand from '../../../apps/case-entity/src/components/variants/occurrence-table/occurrence-expand';

// Purposely used absolute paths since variant app is not a dependency of the components library
import { useI18n } from '@/components/hooks/i18n';
import FiltersGroupSkeleton from '@/components/base/filters-group/filters-group-skeleton';

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
  title: 'Data Display/Data Table',
  component: DataTable,
  args: {
    id: 'variant',
    columns: [],
    data: [],
    defaultServerSorting: [
      {
        field: 'pf_wgs',
        order: SortBodyOrderEnum.Asc,
      },
    ],
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
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    loadingStates: {
      list: true,
      total: true,
    },
    data: [],
    enableColumnOrdering: true,
    enableFullscreen: true,
    defaultColumnSettings: occurenceDefaultsSettings,
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
    enableColumnOrdering: true,
    enableFullscreen: true,
    defaultColumnSettings: occurenceDefaultsSettings,
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
    enableColumnOrdering: true,
    enableFullscreen: true,
    defaultColumnSettings: occurenceDefaultsSettings,
  },
  render: args => <DataTable {...args} />,
};



export const VariantOccurrence: Story = {
  args: {
    id: 'variant-occurence',
    defaultColumnSettings: occurenceDefaultsSettings,
  },
  render: args => {
    const { t } = useI18n();

    return (
      <DataTable
        {...args}
        pagination={{
          pageIndex: 0,
          pageSize: 50,
        }}
        data={occurrencesData}
        columns={getVariantColumns(t)}
        subComponent={occurrence => <OccurrenceExpand occurrence={occurrence} />}
        enableFullscreen
        enableColumnOrdering
      />
    );
  },
};

export const Cases: Story = {
  args: {
    id: 'case-exploration',
    defaultColumnSettings: caseDefaultsSettings,
  },
  render: args => {
    const { t } = useI18n();

    return (
      <DataTable
        {...args}
        pagination={{
          pageIndex: 0,
          pageSize: 50,
        }}
        total={12}
        data={casesData}
        columns={getCaseExplorationColumns(t)}
        tableIndexResultPosition="bottom"
        enableFullscreen
        enableColumnOrdering
      />
    );
  },
};

export const LoadingWithFiltersGroup: Story = {
  args: {
    loadingStates: {
      list: true,
      total: true,
    },
    data: [],
    enableColumnOrdering: true,
    enableFullscreen: true,
    defaultColumnSettings: occurenceDefaultsSettings,
    tableIndexResultPosition: 'hidden',
    TableFilters: FiltersGroupSkeleton,
  },
  render: args => <DataTable {...args} />,
};
