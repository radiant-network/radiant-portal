import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/base/ui/badge';
import { fn } from '@storybook/test';
import { badgeSizes, badgeVariants } from './utils';

const meta = {
  title: 'Base/Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {
    size: 'default',
  },
  render: args => (
    <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => (
        <Badge variant={variant} {...args}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const Closable: Story = {
  args: {
    children: 'Badge',
    onClose: fn(),
  },
  render: args => <Badge {...args} />,
};

export const Sizes: Story = {
  args: {
    variant: 'default',
  },
  render: args => {
    return (
      <div className="flex flex-col items-start gap-2">
        {badgeSizes.map(size => (
          <Badge size={size} {...args}>
            Badge {size}
          </Badge>
        ))}
      </div>
    );
  },
};
