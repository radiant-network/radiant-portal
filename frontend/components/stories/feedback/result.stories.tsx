import type { Meta, StoryObj } from '@storybook/react';
import Result from '@/components/base/result';
import { Button } from '@/components/base/ui/button';

const meta = {
  title: 'Feedback/Result',
  component: Result,
  args: {
    status: '404',
    message: 'Page not found',
    extra: <Button>Go to dashboard</Button>,
  },
} satisfies Meta<typeof Result>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    return (
      <div className="flex justify-center p-24">
        <Result {...args} />
      </div>
    );
  },
};
