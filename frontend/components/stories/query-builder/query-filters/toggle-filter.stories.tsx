import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { ToggleFilter } from '@/components/base/query-filters/toggle-filter';
import { ConfigProvider, PortalConfig } from '@/components/cores/applications-config';
import { queryBuilderRemote } from '@/components/cores/query-builder/query-builder-remote';

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
  render: args => (
    <div className="space-y-3">
      <ToggleFilter {...args} />
    </div>
  ),
};

export const DataAppliedToQueryBuilder: Story = {
  render: args => {
    action('activeQuery')(
      queryBuilderRemote.updateActiveQueryField(config.snv_occurrence.app_id, {
        field: 'is_canonical',
        value: ['true'],
      }),
    );
    return (
      <div className="space-y-3">
        <ToggleFilter {...args} />
      </div>
    );
  },
};
