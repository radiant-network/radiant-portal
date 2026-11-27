import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import DistributionBar, {
  DISTRIBUTION_BAR_COLORS,
  type DistributionBarItem,
} from '@/components/base/distribution-bar/distribution-bar';
import DistributionFilter from '@/components/base/distribution-bar/distribution-filter';
import DistributionLegend from '@/components/base/distribution-bar/distribution-legend';

import { StorySection, StoryShowcase } from '../story-section';

const statusItems: DistributionBarItem[] = [
  { key: 'pass', label: 'Pass', value: 147, color: 'emerald' },
  { key: 'warning', label: 'Warning', value: 26, color: 'amber' },
  { key: 'fail', label: 'Fail', value: 23, color: 'red' },
  { key: 'unmappable', label: 'Unmappable', value: 17, color: 'grey' },
];

const meta = {
  title: 'Components/Distribution Bar',
  component: DistributionBar,
  args: {
    items: statusItems,
    colorblindMode: false,
  },
  decorators: [
    Story => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DistributionBar>;

export default meta;

type Story = StoryObj<typeof meta>;

function BarWithLegend({ items, colorblindMode }: { items: DistributionBarItem[]; colorblindMode?: boolean }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <DistributionBar items={items} colorblindMode={colorblindMode} />
      <DistributionLegend items={items} colorblindMode={colorblindMode} />
    </div>
  );
}

export const Default: Story = {
  render: args => <BarWithLegend items={args.items} colorblindMode={args.colorblindMode} />,
};

export const AllColors: Story = {
  args: {
    items: DISTRIBUTION_BAR_COLORS.map(color => ({ key: color, label: color, value: 10, color })),
  },
  render: args => (
    <StoryShowcase>
      <StorySection
        title="All colors"
        description={`Available colors for the items, editable in the controls: ${DISTRIBUTION_BAR_COLORS.join(', ')}.`}
      >
        <BarWithLegend items={args.items} />
      </StorySection>

      <StorySection title="All colors, colorblind mode">
        <BarWithLegend items={args.items} colorblindMode />
      </StorySection>
    </StoryShowcase>
  ),
};

function BarWithFilter({ items, colorblindMode }: { items: DistributionBarItem[]; colorblindMode?: boolean }) {
  const [value, setValue] = useState<string[]>([]);

  return (
    <div className="flex w-full flex-col gap-2.5">
      <DistributionBar items={items} colorblindMode={colorblindMode} />
      <DistributionFilter
        items={items}
        value={value}
        onValueChange={setValue}
        allLabel="All"
        colorblindMode={colorblindMode}
      />
      <p className="text-sm text-muted-foreground">
        Selected: {value.length === 0 ? 'all' : value.join(', ')} · Count:{' '}
        {items
          .filter(item => value.length === 0 || value.includes(item.key))
          .reduce((sum, item) => sum + item.value, 0)}
      </p>
    </div>
  );
}

export const Filter: Story = {
  render: args => (
    <StoryShowcase>
      <StorySection
        title="Bar with filter"
        description="Several items can be selected. All clears the selection, and selecting every item comes back to All. An item with a zero value stays clickable."
      >
        <BarWithFilter items={args.items} colorblindMode={args.colorblindMode} />
      </StorySection>

      <StorySection title="Colorblind mode">
        <BarWithFilter items={args.items} colorblindMode />
      </StorySection>

      <StorySection title="Item with a zero value">
        <BarWithFilter items={statusItems.map(item => (item.key === 'warning' ? { ...item, value: 0 } : item))} />
      </StorySection>
    </StoryShowcase>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Bar with legend">
        <BarWithLegend items={statusItems} />
      </StorySection>

      <StorySection title="Colorblind mode" description="A pattern per item position, as in the charts.">
        <BarWithLegend items={statusItems} colorblindMode />
      </StorySection>

      <StorySection title="Bar only">
        <DistributionBar items={statusItems} />
      </StorySection>

      <StorySection title="Item with a zero value" description="Hidden in the bar, kept in the legend.">
        <BarWithLegend items={statusItems.map(item => (item.key === 'fail' ? { ...item, value: 0 } : item))} />
      </StorySection>

      <StorySection title="Single item">
        <BarWithLegend items={[statusItems[0]]} />
      </StorySection>

      <StorySection title="Empty" description="Every value is zero.">
        <BarWithLegend items={statusItems.map(item => ({ ...item, value: 0 }))} />
      </StorySection>
    </StoryShowcase>
  ),
};
