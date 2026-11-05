import type { Meta, StoryObj } from '@storybook/react-vite';

import ConfidenceGauge from '@/components/base/gauge/confidence-gauge';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Gauges/Confidence Gauge',
  component: ConfidenceGauge,
  args: {
    percent: 95,
  },
} satisfies Meta<typeof ConfidenceGauge>;

export default meta;

type Story = StoryObj<typeof meta>;

const RANGES: { label: string; percent: number | null }[] = [
  { label: 'High (>90%)', percent: 95 },
  { label: 'Mid (75–90%)', percent: 80 },
  { label: 'Low (<75%)', percent: 50 },
  { label: 'None (no value)', percent: null },
];

function renderRanges(args: React.ComponentProps<typeof ConfidenceGauge>, title: string) {
  return (
    <StorySection title={title}>
      <div className="flex items-start gap-6">
        {RANGES.map(({ label, percent }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <ConfidenceGauge {...args} percent={percent} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </StorySection>
  );
}

export const Default: Story = {
  args: {},
  render: args => renderRanges(args, 'Default'),
};

export const Large: Story = {
  args: { size: 64, strokeWidth: 6 },
  render: args => renderRanges(args, 'Large'),
};
