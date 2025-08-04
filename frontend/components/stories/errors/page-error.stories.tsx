import type { Meta, StoryObj } from '@storybook/react';
import PageError from '@/components/base/page/page-error';
import { Button } from '@/components/base/ui/button';

const meta = {
  title: 'Error/Page-Error',
  component: PageError,
  args: {
    status: '404',
    message: 'Page not found',
    extra: <Button>Go to dashboard</Button>,
  },
} satisfies Meta<typeof PageError>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NotFound404: Story = {
  render: args => {
    return (
      <div className="flex justify-center p-24">
        <PageError {...args} />
      </div>
    );
  },
};
