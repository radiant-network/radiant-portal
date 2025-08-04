import type { Meta, StoryObj } from '@storybook/react';
import NumberBadge from '@/components/base/badges/number-badge';
import { numberBadgeVariants } from './utils';

const meta = {
  title: 'Badges/Number Badge',
  component: NumberBadge,
  args: {
    count: 5,
    offsetTop: 5,
  },
} satisfies Meta<typeof NumberBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
  render: args => (
    <div className="flex flex-col items-start gap-2">
      {numberBadgeVariants.map(variant => (
        <NumberBadge variant={variant} {...args}>
          {variant}
        </NumberBadge>
      ))}
    </div>
  ),
};
