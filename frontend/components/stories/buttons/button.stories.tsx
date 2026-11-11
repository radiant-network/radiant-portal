import type { Meta, StoryObj } from '@storybook/react-vite';
import { Circle } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '@/components/base/shadcn/button';
import { Separator } from '@/components/base/shadcn/separator';

import { StoryLabel, StorySection } from '../story-section';

import { buttonSizes, buttonVariants } from './utils';

const meta = {
  title: 'Components/Buttons/Button',
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
    <StorySection title="Variants">
      <div className="space-y-2">
        <StoryLabel>Text only</StoryLabel>
        {buttonVariants.map(variant => (
          <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => (
              <Button key={size} size={size} variant={variant}>
                Button {size}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <StoryLabel>Icon only</StoryLabel>
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

      <div className="space-y-2">
        <StoryLabel>Icon + text</StoryLabel>
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
    </StorySection>
  ),
};
