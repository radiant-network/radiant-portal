import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bold } from 'lucide-react';
import { VariantProps } from 'tailwind-variants';

import { Toggle, toggleVariants } from '@/components/base/shadcn/toggle';

import { StorySection, StoryShowcase } from '../story-section';

const toggleSizes: VariantProps<typeof toggleVariants>['size'][] = ['xxs', 'xs', 'sm', 'default', 'lg'];
const toggleVariantOptions: VariantProps<typeof toggleVariants>['variant'][] = ['default', 'outline'];

const meta = {
  title: 'Components/Toggles/Toggle',
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

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Icon + text">
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
      </StorySection>

      <StorySection title="Icon only">
        {toggleVariantOptions.map(variant => (
          <div key={variant} className="flex gap-2 items-center">
            {toggleSizes.map(size => (
              <Toggle key={size} size={size} variant={variant}>
                <Bold />
              </Toggle>
            ))}
          </div>
        ))}
      </StorySection>

      <StorySection title="Text only">
        {toggleVariantOptions.map(variant => (
          <div key={variant} className="flex gap-2 items-center">
            {toggleSizes.map(size => (
              <Toggle key={size} size={size} variant={variant}>
                Text
              </Toggle>
            ))}
          </div>
        ))}
      </StorySection>
    </StoryShowcase>
  ),
};
