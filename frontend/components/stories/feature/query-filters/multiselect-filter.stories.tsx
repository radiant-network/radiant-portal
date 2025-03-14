import type { Meta, StoryObj } from '@storybook/react';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { MultiSelectFilter } from '@/components/feature/query-filters/multiselect-filter';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';

const config: PortalConfig = {
  variant_entity: {
    app_id: 'variant_entity',
    aggregations: [
      { key: 'chromosome', type: 'multiple' },
      { key: 'filter', type: 'multiple' },
      { key: 'zygosity', type: 'multiple' },
      { key: 'impact_score', type: 'multiple' },
      { key: 'variant_class', type: 'multiple' },
      { key: 'symbol', type: 'multiple' },
    ],
  },
};

const meta = {
  title: 'Feature/Query Filters/Multi Select',
  component: MultiSelectFilter,
  tags: ['autodocs'],
  args: {
    data: [],
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
  args: {
    data: [
      {
        key: 'Option 1',
        count: 100,
      },
      {
        key: 'Option 2',
        count: 200,
      },
      {
        key: 'Option 3',
        count: 300,
      },
      {
        key: 'Option 4',
        count: 400,
      },
      {
        key: 'Option 5',
        count: 500,
      },
      {
        key: 'Option 6',
        count: 600,
      },
    ],
    appliedItems: [],
  },
  render: args => {
    return (
      <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>
    );
  },
};

export const DataAppliedToQueryBuilder: Story = {
  args: {
    data: [
      {
        key: 'Option6',
        count: 600,
      },
      {
        key: 'Option5',
        count: 500,
      },
      {
        key: 'Option4',
        count: 400,
      },
      {
        key: 'Option3',
        count: 300,
      },
      {
        key: 'Option2',
        count: 200,
      },
      {
        key: 'Option1',
        count: 100,
      },
    ],
  },
  render: args => {
    queryBuilderRemote.updateActiveQueryField('variant_entity', {
      field: 'chromosome',
      value: ['Option1', 'Option4'],
    });
    console.log('querybuild : ', queryBuilderRemote.getActiveQuery('variant_entity'));
    return (
      <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>
    );
  },
};

export const HiddenSearch: Story = {
  args: {
    data: [
      {
        key: 'Option6',
        count: 600,
      },
      {
        key: 'Option5',
        count: 500,
      },
    ],
    searchVisible: false,
  },
  render: args => {
    return (
      <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>
    );
  },
};
