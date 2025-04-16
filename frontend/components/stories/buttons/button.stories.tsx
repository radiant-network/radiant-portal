import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from '@/components/base/ui/button';
import { buttonSizes, buttonVariants } from './utils';
import { IdCardIcon } from 'lucide-react';

const meta = {
  title: 'Buttons/Button',
  component: Button,
  args: { onClick: fn(), loading: false, disabled: false, iconOnly: false },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {
    size: 'default',
  },
  render: args => {
    return (
      <div className="flex flex-col items-start gap-2">
        {buttonVariants.map(variant => (
          <Button variant={variant} {...args}>
            {variant}
          </Button>
        ))}
      </div>
    );
  },
};

export const IconOnly: Story = {
  args: {
    size: 'default',
    iconOnly: true,
  },
  render: args => {
    return (
      <div className="flex flex-col items-start gap-2">
        {buttonVariants.map(variant => (
          <Button variant={variant} {...args}>
            <IdCardIcon />
          </Button>
        ))}
      </div>
    );
  },
};

export const Sizes: Story = {
  args: {
    variant: 'default',
  },
  render: args => {
    return (
      <div className="flex flex-col items-start gap-2">
        {buttonSizes.map(size => (
          <Button size={size} {...args}>
            Button {size}
          </Button>
        ))}
      </div>
    );
  },
};
