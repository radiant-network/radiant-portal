import type { Meta, StoryObj } from '@storybook/react-vite';
import { User } from 'lucide-react';
import { expect, fn, userEvent } from 'storybook/test';

import { Badge } from '@/components/base/shadcn/badge';

import { StorySection } from '../story-section';

import { badgeVariants } from './utils';

const meta = {
  title: 'Components/Badges/Badge',
  component: Badge,
  tags: ['vitest'],
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/IsQJi9M07hQCLhc6Vu8Wyd/shadcn-ui-kit---March-2026?node-id=23-995',
    },
  },
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
  play: async ({ canvas }) => {
    for (const variant of badgeVariants) {
      await expect(canvas.getByText(variant!)).toBeVisible();
    }
  },
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
  play: async ({ canvas, args }) => {
    const removeButtons = canvas.getAllByRole('button', { name: 'Remove' });
    await expect(removeButtons).toHaveLength(badgeVariants.length);

    await userEvent.click(removeButtons[0]);
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
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
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByText('default'));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
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
  play: async ({ canvas }) => {
    for (const variant of badgeVariants) {
      await expect(canvas.getByText(variant!).querySelector('svg')).toBeInTheDocument();
    }
  },
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
  play: async ({ canvasElement }) => {
    const icons = canvasElement.querySelectorAll('svg');
    await expect(icons).toHaveLength(badgeVariants.length);
    for (const icon of icons) {
      await expect(icon.parentElement?.textContent).toBe('');
    }
  },
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
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('10')).toHaveLength(badgeVariants.length);
  },
};
