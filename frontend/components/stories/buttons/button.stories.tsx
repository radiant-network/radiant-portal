import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Circle } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';

import { buttonSizes, buttonVariants } from './utils';

const meta = {
  title: 'Buttons/Button',
  component: Button,
  argTypes: {
    size: {
      options: buttonSizes,
      control: {
        type: 'select',
      },
    },
  },
  args: { onClick: fn(), loading: false, disabled: false, iconOnly: false },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => (
        <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => (
            <Button key={size} size={size} variant={variant}>
              Button {size}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
  },
  render: args => (
    <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => (
        <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => (
            <Button key={size} size={size} variant={variant} {...args}>
              <Circle />
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const IconAndText: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => (
        <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => (
            <Button key={size} size={size} variant={variant}>
              <Circle />
              Button {size}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};
