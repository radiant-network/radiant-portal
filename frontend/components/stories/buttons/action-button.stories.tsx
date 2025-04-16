import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import ActionButton from '@/components/base/buttons/ActionButton';
import { buttonVariants } from './utils';

const meta = {
  title: 'Buttons/Action Button',
  component: ActionButton,
  args: { onClick: fn(), size: 'default', disabled: false, actions: [], onDefaultAction: fn() },
} satisfies Meta<typeof ActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {
    size: 'default',
    children: 'Button',
  },
  render: args => {
    return (
      <div className="flex flex-col gap-2">
        {buttonVariants.map(variant => (
          <ActionButton variant={variant} {...args}>
            {variant}
          </ActionButton>
        ))}
      </div>
    );
  },
};
