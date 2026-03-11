import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bold } from 'lucide-react';
import { VariantProps } from 'tailwind-variants';

import { Toggle, toggleVariants } from '@/components/base/shadcn/toggle';

const toggleSizes: VariantProps<typeof toggleVariants>['size'][] = ['xxs', 'xs', 'sm', 'default', 'lg'];
const toggleVariantOptions: VariantProps<typeof toggleVariants>['variant'][] = ['default', 'outline'];

const meta = {
  title: 'Toggle/Toggle',
  component: Toggle,
  argTypes: {
    size: {
      options: toggleSizes,
      control: { type: 'select' },
    },
    variant: {
      options: toggleVariantOptions,
      control: { type: 'select' },
    },
  },
  args: { disabled: false },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      {toggleVariantOptions.map(variant => (
        <div key={variant} className="flex gap-2 items-center">
          {toggleSizes.map(size => (
            <Toggle key={size} size={size} variant={variant}>
              <Bold />
              Text
            </Toggle>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      {toggleVariantOptions.map(variant => (
        <div key={variant} className="flex gap-2 items-center">
          {toggleSizes.map(size => (
            <Toggle key={size} size={size} variant={variant}>
              <Bold />
            </Toggle>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const TextOnly: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      {toggleVariantOptions.map(variant => (
        <div key={variant} className="flex gap-2 items-center">
          {toggleSizes.map(size => (
            <Toggle key={size} size={size} variant={variant}>
              Text
            </Toggle>
          ))}
        </div>
      ))}
    </div>
  ),
};
