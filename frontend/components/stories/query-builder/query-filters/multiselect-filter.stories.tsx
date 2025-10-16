import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { MultiSelectFilter } from '@/components/feature/query-filters/multiselect-filter';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';
import { config as configMock } from './config-mock';

const config: PortalConfig = {
  ...configMock,
  snv_occurrence: {
    ...configMock.snv_occurrence,
    aggregations: {
      variant: {
        items: [
          { key: 'chromosome', type: 'multiple' },
          { key: 'filter', type: 'multiple' },
          { key: 'zygosity', type: 'multiple' },
          { key: 'impact_score', type: 'multiple' },
          { key: 'variant_class', type: 'multiple' },
          { key: 'symbol', type: 'multiple' },
        ],
      },
    },
  },
};

const meta = {
  title: 'QueryBuilder/Query Filters/Multi Select',
  component: MultiSelectFilter,
  args: {
    field: { key: 'chromosome', type: 'multiple' },
    maxVisibleItems: 10,
    searchVisible: true,
  },
  decorators: [
    Story => (
      <ConfigProvider config={config}>
        <Story />
      </ConfigProvider>
    ),
  ],
} satisfies Meta<typeof MultiSelectFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    return (
      <div className="space-y-3">
        <MultiSelectFilter {...args} />
      </div>
    );
  },
};

export const DataAppliedToQueryBuilder: Story = {
  render: args => {
    action('activeQuery')(
      queryBuilderRemote.updateActiveQueryField(config.snv_occurrence.app_id, {
        field: 'chromosome',
        value: ['Option1', 'Option4'],
      }),
    );
    return (
      <div className="space-y-3">
        <MultiSelectFilter {...args} />
      </div>
    );
  },
};

export const HiddenSearch: Story = {
  args: {
    searchVisible: false,
  },
  render: args => {
    return (
      <div className="space-y-3">
        <MultiSelectFilter {...args} />
      </div>
    );
  },
};
