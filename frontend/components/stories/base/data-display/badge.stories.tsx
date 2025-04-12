import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/base/ui/badge';
import { fn } from '@storybook/test';
import { badgeVariants } from './utils';
import { User } from 'lucide-react';

const meta = {
  title: 'Base/Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
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

export const Clickable: Story = {
  args: {
    children: 'Badge',
    onClick: fn(),
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

export const WithIcon: Story = {
  args: {
    children: 'Badge',
  },
  render: args => (
    <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => (
        <Badge variant={variant} {...args}>
          {variant} <User />
        </Badge>
      ))}
    </div>
  ),
};
