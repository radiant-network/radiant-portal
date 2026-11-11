import type { Meta, StoryObj } from '@storybook/react-vite';

import NumberBadge from '@/components/base/badges/number-badge';

import { StorySection } from '../story-section';

import { numberBadgeVariants } from './utils';

const meta = {
  title: 'Components/Badges/Number Badge',
  component: NumberBadge,
  args: {
    count: 5,
    offsetTop: 5,
  },
} satisfies Meta<typeof NumberBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
  render: args => (
    <StorySection title="Variants">
      <div className="flex flex-col items-start gap-2">
        {numberBadgeVariants.map((variant, index) => (
          <NumberBadge key={index} variant={variant} {...args}>
            {variant}
          </NumberBadge>
        ))}
      </div>
    </StorySection>
  ),
};
