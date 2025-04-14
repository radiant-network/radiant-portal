import BackLink from '@/components/base/navigation/back-link';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Navigation/BackLink',
  component: BackLink,
  args: {},
} satisfies Meta<typeof BackLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => {
    return <BackLink>Back</BackLink>;
  },
};
