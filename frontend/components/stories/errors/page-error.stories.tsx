import type { Meta, StoryObj } from '@storybook/react-vite';

import PageError from '@/components/base/page/page-error';
import { Button } from '@/components/base/shadcn/button';

import { StorySection } from '../story-section';

const meta = {
  title: 'Layout/Page Error',
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
  render: args => (
    <StorySection title="Not found (404)">
      <div className="flex w-full p-24 justify-center">
        <PageError {...args} />
      </div>
    </StorySection>
  ),
};
