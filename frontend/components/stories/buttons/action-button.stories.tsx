import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import ActionButton from '@/components/base/buttons/action-button';

import { StorySection } from '../story-section';

import { buttonSizes, buttonVariants } from './utils';

const meta = {
  title: 'Components/Buttons/Action Button',
  component: ActionButton,
  args: { onClick: fn(), size: 'default', disabled: false, actions: [], onDefaultAction: fn() },
} satisfies Meta<typeof ActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorAndSize: Story = {
  args: {
    children: 'Button',
    actions: [
      {
        id: 'action_1',
        label: 'action 1',
        onClick: () => {},
      },
      {
        id: 'action_2',
        label: 'action 2',
        onClick: () => {},
      },
      {
        id: 'action_3',
        label: 'action 3',
        onClick: () => {},
      },
    ],
  },
  render: args => (
    <StorySection title="Color and size">
      <div className="flex flex-col gap-6">
        {buttonVariants.map(variant => (
          <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => (
              <ActionButton key={`${variant}-${size}`} {...args} variant={variant} size={size}>
                {variant}-{size}
              </ActionButton>
            ))}
          </div>
        ))}
      </div>
    </StorySection>
  ),
};
