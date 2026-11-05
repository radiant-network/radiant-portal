import type { Meta, StoryObj } from '@storybook/react-vite';

import Gauge from '@/components/base/gauge/gauge';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Gauges/Gauge',
  component: Gauge,
  args: {
    percent: 75,
  },
} satisfies Meta<typeof Gauge>;

export default meta;

type Story = StoryObj<typeof meta>;

const VARIANTS: { label: string; percent: number | null; className?: string }[] = [
  { label: 'Green (95%)', percent: 95, className: 'stroke-green' },
  { label: 'Amber (80%)', percent: 80, className: 'stroke-amber' },
  { label: 'Red (50%)', percent: 50, className: 'stroke-red' },
  { label: 'Empty', percent: null },
];

function renderVariants(args: React.ComponentProps<typeof Gauge>, title: string) {
  return (
    <StorySection title={title}>
      <div className="flex items-start gap-6">
        {VARIANTS.map(({ label, percent, className }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <Gauge {...args} percent={percent} className={className} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </StorySection>
  );
}

export const Default: Story = {
  args: {},
  render: args => renderVariants(args, 'Default'),
};

export const Large: Story = {
  args: { size: 64, strokeWidth: 6 },
  render: args => renderVariants(args, 'Large'),
};
