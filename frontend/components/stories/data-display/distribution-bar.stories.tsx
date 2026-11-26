import type { Meta, StoryObj } from '@storybook/react-vite';

import DistributionBar, { type DistributionBarItem } from '@/components/base/distribution-bar/distribution-bar';
import DistributionLegend from '@/components/base/distribution-bar/distribution-legend';

import { StorySection, StoryShowcase } from '../story-section';

const statusItems: DistributionBarItem[] = [
  { key: 'pass', label: 'Pass', value: 147, color: 'green' },
  { key: 'warning', label: 'Warning', value: 26, color: 'amber' },
  { key: 'fail', label: 'Fail', value: 23, color: 'red' },
  { key: 'unmappable', label: 'Unmappable', value: 17, color: 'neutral' },
];

const meta = {
  title: 'Components/Distribution Bar',
  component: DistributionBar,
  args: {
    items: statusItems,
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

function BarWithLegend({ items }: { items: DistributionBarItem[] }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <DistributionBar items={items} />
      <DistributionLegend items={items} />
    </div>
  );
}

export const Default: Story = {
  render: args => <BarWithLegend items={args.items} />,
};

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Bar with legend">
        <BarWithLegend items={statusItems} />
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
