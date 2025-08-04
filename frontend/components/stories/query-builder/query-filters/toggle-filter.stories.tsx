import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { ToggleFilter } from '@/components/feature/query-filters/toggle-filter';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';
import { config as configMock } from './config-mock';

const config: PortalConfig = {
  ...configMock,
  variant_exploration: {
    ...configMock.variant_exploration,
    aggregations: {
      variant: {
        items: [
          { key: 'chromosome', type: 'multiple' },
          { key: 'filter', type: 'multiple' },
          { key: 'zygosity', type: 'multiple' },
          { key: 'impact_score', type: 'multiple' },
          { key: 'variant_class', type: 'multiple' },
          { key: 'symbol', type: 'multiple' },
          { key: 'is_canonical', type: 'boolean' },
        ],
      },
    },
  },
};

const meta = {
  title: 'QueryBuilder/Query Filters/Toggle Filter',
  component: ToggleFilter,

  args: {
    field: { key: 'is_canonical', type: 'boolean' },
  },
  decorators: [
    Story => (
      <ConfigProvider config={config}>
        <Story />
      </ConfigProvider>
    ),
  ],
} satisfies Meta<typeof ToggleFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    return (
      <div className="space-y-6">
        <ToggleFilter {...args} />
      </div>
    );
  },
};

export const DataAppliedToQueryBuilder: Story = {
  render: args => {
    action('activeQuery')(
      queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
        field: 'is_canonical',
        value: ['true'],
      }),
    );
    return (
      <div className="space-y-6">
        <ToggleFilter {...args} />
      </div>
    );
  },
};
