import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/base/ui/badge';
import { fn } from '@storybook/test';
import { badgeColors, badgeVariants } from './utils';

const meta = {
  title: 'Base/Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    variant: 'filled',
    color: 'primary',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-2">
      {badgeColors.map(color => {
        return (
          <div className="flex gap-2">
            {badgeVariants.map(variant => (
              <Badge color={color} variant={variant}>
                {variant}
              </Badge>
            ))}
          </div>
        );
      })}
      <div className="flex gap-2">
        <Badge className="bg-magenta-700">Custom</Badge>
        <Badge className="text-magenta-700 border-magenta-700" variant="outlined">
          Custom
        </Badge>
      </div>
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
  args: {},
  render: () => (
    <div className="flex items-start gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md" color="primary">
        Medium
      </Badge>
      <Badge size="lg" color="primary">
        Large
      </Badge>
    </div>
  ),
};
