import type { Meta, StoryObj } from '@storybook/react-vite';
import { Circle } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '@/components/base/shadcn/button';
import { Separator } from '@/components/base/shadcn/separator';

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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-2">
        <h2>Text Only</h2>
        {buttonVariants.map(variant => (
          <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => (
              <Button key={size} size={size} variant={variant}>
                Button {size}
              </Button>
            ))}
          </div>
        ))}

        <Separator />
        <div className="flex flex-col items-start gap-2">
          <h2>Icon Only</h2>
          {buttonVariants.map(variant => (
            <div key={variant} className="flex gap-2">
              {buttonSizes.map(size => (
                <Button key={size} size={size} variant={variant} iconOnly>
                  <Circle />
                </Button>
              ))}
            </div>
          ))}
        </div>

        <Separator />
        <div className="flex flex-col items-start gap-2">
          <h2>Icon + Text</h2>
          {buttonVariants.map(variant => (
            <div key={variant} className="flex gap-2">
              {buttonSizes.map(size => (
                <Button key={size} size={size} variant={variant}>
                  <Circle />
                  Button {size}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
