import type { Meta, StoryObj } from '@storybook/react-vite';
import { User } from 'lucide-react';
import { fn } from 'storybook/test';

import { Badge } from '@/components/base/shadcn/badge';

import { StorySection } from '../story-section';

import { badgeVariants } from './utils';

const meta = {
  title: 'Components/Badges/Badge',
  component: Badge,
  args: {},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
  render: args => (
    <StorySection title="Variants">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => (
          <Badge key={index} variant={variant} {...args}>
            {variant}
          </Badge>
        ))}
      </div>
    </StorySection>
  ),
};

export const Closable: Story = {
  args: {
    children: 'Badge',
    onClose: fn(),
  },
  render: args => (
    <StorySection title="Closable">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => (
          <Badge key={index} variant={variant} {...args}>
            {variant}
          </Badge>
        ))}
      </div>
    </StorySection>
  ),
};

export const Clickable: Story = {
  args: {
    children: 'Badge',
    onClick: fn(),
  },
  render: args => (
    <StorySection title="Clickable">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => (
          <Badge key={index} variant={variant} {...args}>
            {variant}
          </Badge>
        ))}
      </div>
    </StorySection>
  ),
};

export const WithIcon: Story = {
  args: {
    children: 'Badge',
  },
  render: args => (
    <StorySection title="With icon">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => (
          <Badge key={index} variant={variant} {...args}>
            {variant} <User />
          </Badge>
        ))}
      </div>
    </StorySection>
  ),
};

export const IconOnly: Story = {
  args: {
    children: 'Badge',
    iconOnly: true,
  },
  render: args => (
    <StorySection title="Icon only">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => (
          <Badge key={index} variant={variant} {...args}>
            <User />
          </Badge>
        ))}
      </div>
    </StorySection>
  ),
};

export const WithCount: Story = {
  args: {
    children: 'Badge',
    count: 10,
  },
  render: args => (
    <StorySection title="With count">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => (
          <Badge key={index} variant={variant} {...args}>
            {variant}
          </Badge>
        ))}
      </div>
    </StorySection>
  ),
};
