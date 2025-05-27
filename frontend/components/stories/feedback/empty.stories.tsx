import type { Meta, StoryObj } from '@storybook/react';
import Empty from '@/components/base/empty';

const meta = {
  title: 'Feedback/Empty',
  component: Empty,
  args: {},
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['mini', 'default'],
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
  },
  render: args => {
    return <Empty {...args} />;
  },
};
