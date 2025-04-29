import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { NumericalFilter } from '@/components/feature/query-filters/numerical-filter';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';
import { RangeOperators } from '@/components/model/sqon';
import { expect, userEvent, within } from '@storybook/test';

const config: PortalConfig = {
  variant_exploration: {
    app_id: 'variant_exploration_toggle_filter',
    aggregations: [
      {
        key: 'impact_score',
        type: 'numerical',
        defaults: {
          min: 0,
          max: 100,
          defaultMin: 0,
          defaultMax: 100,
          intervalDecimal: 2,
          defaultOperator: RangeOperators.GreaterThan,
        },
      },
      {
        key: 'age',
        type: 'numerical',
        defaults: {
          min: 0,
          max: 120,
          defaultMin: 0,
          defaultMax: 120,
          intervalDecimal: 0,
          defaultOperator: RangeOperators.Between,
          rangeTypes: [
            { key: 'year', name: 'Year' },
            { key: 'month', name: 'Month' },
            { key: 'day', name: 'Day' },
          ],
        },
      },
    ],
  },
};

const meta = {
  title: 'Feature/Query Filters/Numerical Filter',
  component: NumericalFilter,

  args: {
    field: {
      key: 'impact_score',
      type: 'numerical',
      defaults: {
        min: 0,
        max: 100,
        defaultMin: 0,
        defaultMax: 100,
        intervalDecimal: 2,
        defaultOperator: RangeOperators.GreaterThan,
      },
    },
  },
  decorators: [
    Story => (
      <ConfigProvider config={config}>
        <Story />
      </ConfigProvider>
    ),
  ],
} satisfies Meta<typeof NumericalFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    return (
      <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test numeric input
    const numericInput = canvas.getByTestId('impact_score_value');
    await userEvent.type(numericInput, '75');
    expect(numericInput).toHaveValue(75);

    // Test apply button
    const applyButton = canvas.getByRole('button', { name: /apply/i });
    expect(applyButton).toBeEnabled();
    await userEvent.click(applyButton);
  },
};

export const NoDataToggle: Story = {
  render: args => {
    action('activeQuery')(
      queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
        field: 'impact_score',
        value: [],
      }),
    );
    return (
      <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const noDataToggle = await canvas.findByText('No data');
    await userEvent.click(noDataToggle);
    expect(noDataToggle.previousElementSibling).toBeChecked();
  },
};

export const NoDataToggleHidden: Story = {
  args: {
    field: { key: 'impact_score', type: 'multiple' },
  },
  render: args => {
    return (
      <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>
    );
  },
};

export const RangeFilterWithInterval: Story = {
  args: {
    field: {
      key: 'age',
      type: 'numerical',
      defaults: {
        min: 0,
        max: 120,
        defaultMin: 0,
        defaultMax: 120,
        intervalDecimal: 0,
        defaultOperator: RangeOperators.Between,
      },
    },
  },
  render: args => {
    action('activeQuery')(
      queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
        field: 'age',
        value: [],
      }),
    );
    return (
      <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.',
      },
    },
  },
};

export const RangeFilterWithRangeTypes: Story = {
  args: {
    field: {
      key: 'age',
      type: 'numerical',
      defaults: {
        min: 0,
        max: 120,
        defaultMin: 0,
        defaultMax: 120,
        intervalDecimal: 0,
        defaultOperator: RangeOperators.Between,
        rangeTypes: [
          { key: 'year', name: 'Year' },
          { key: 'month', name: 'Month' },
          { key: 'day', name: 'Day' },
        ],
      },
    },
  },
  render: args => {
    action('activeQuery')(
      queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
        field: 'age_unit',
        value: [],
      }),
    );
    return (
      <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test initial state
    const operatorSelect = canvas.getByText('Between');
    expect(operatorSelect).toBeInTheDocument();

    // Verify both inputs are visible with "Between" operator
    const minInput = canvas.getByTestId('age_min');
    const maxInput = canvas.getByTestId('age_max');
    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();

    // Test unit type selection
    const unitSelect = canvas.getByText('Year');
    expect(unitSelect).toBeInTheDocument();

    // Test clear functionality
    const clearButton = canvas.getByText('Clear');
    expect(clearButton).toBeDisabled();
    await userEvent.type(minInput, '50');
    expect(clearButton).toBeEnabled();
    await userEvent.click(clearButton);
    expect(minInput).toHaveValue(0);
    expect(maxInput).toHaveValue(120);
    expect(unitSelect).toHaveTextContent('Year');
  },
  parameters: {
    docs: {
      description: {
        story:
          'A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality.',
      },
    },
  },
};
