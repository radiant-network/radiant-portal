import BackLink from '@/components/base/navigation/back-link';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Links/BackLink',
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
