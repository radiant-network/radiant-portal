import BackLink from '@/components/base/back-link';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Base/Navigation/BackLink',
  component: BackLink,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof BackLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
  render: () => {
    return <BackLink>Back</BackLink>;
  },
};
