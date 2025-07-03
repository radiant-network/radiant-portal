import type { Meta, StoryObj } from '@storybook/react';
import { Indicator } from '@/components/base/ui/indicator';
import { indicatorVariants } from './utils';

const meta = {
  title: 'Data Display/Indicator',
  component: Indicator,
  args: {},
} satisfies Meta<typeof Indicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
  render: args => (
    <div className="flex flex-col items-start gap-2">
      {indicatorVariants.map(variant => (
        <Indicator variant={variant} {...args} />
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    children: 'Badge',
  },
  render: args => (
    <div className="flex flex-col items-start gap-2">
      {indicatorVariants.map(variant => (
        <Indicator variant={variant} {...args}>
          <span>Text</span>
        </Indicator>
      ))}
    </div>
  ),
};
