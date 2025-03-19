import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from '@/components/base/ui/button';
import { buttonColors, buttonVariants } from './utils';

const meta = {
  title: 'Base/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  args: { onClick: fn(), size: 'default' },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-2">
      {buttonColors.map(color => {
        return (
          <div className="flex gap-2">
            {buttonVariants.map(variant => (
              <Button color={color} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
        );
      })}
    </div>
  ),
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <div className="flex gap-2">
      <Button size="default" color="primary">
        Default
      </Button>
      <Button size="xs" color="primary">
        Button xs
      </Button>
      <Button size="sm" color="primary">
        Button sm
      </Button>
      <Button size="md" color="primary">
        Button md
      </Button>
      <Button size="lg" color="primary">
        Button lg
      </Button>
    </div>
  ),
};
