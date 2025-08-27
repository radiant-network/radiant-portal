import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import ActionButton from '@/components/base/buttons/action-button';

const meta = {
  title: 'Buttons/Action Button',
  component: ActionButton,
  args: { onClick: fn(), size: 'default', disabled: false, actions: [], onDefaultAction: fn() },
} satisfies Meta<typeof ActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {
    children: 'Button',
    actions: [
      {
        label: 'action 1',
        onClick: () => {},
      },
      {
        label: 'action 2',
        onClick: () => {},
      },
      {
        label: 'action 3',
        onClick: () => {},
      },
    ],
  },
  render: args => (
    <div className="flex flex-col gap-6">
      {['default', 'outline', 'secondary', 'destructive'].map(variant => (
        <div key={variant} className="flex gap-2">
          {['xxs', 'xs', 'sm', 'default', 'lg'].map(size => (
            <ActionButton key={`${variant}-${size}`} {...args} variant={variant} size={size}>
              {variant}-{size}
            </ActionButton>
          ))}
        </div>
      ))}
    </div>
  ),
};
