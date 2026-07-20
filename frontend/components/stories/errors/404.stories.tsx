import type { Meta, StoryObj } from '@storybook/react-vite';

import Error404 from '@/components/base/errors/404';
import { Button } from '@/components/base/shadcn/button';

import { StorySection } from '../story-section';

const meta = {
  title: 'Layout/Page Error/404',
  component: Error404,
  args: {
    message: 'Page not found',
    extra: <Button>Go to list</Button>,
  },
} satisfies Meta<typeof Error404>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NotFound404: Story = {
  render: args => (
    <StorySection
      title="Not found (404)"
      description="Rendered within the app layout (navbar/sidebar), not a full-screen takeover like the 403 page — for now."
    >
      <div className="flex w-full p-24 justify-center">
        <Error404 {...args} />
      </div>
    </StorySection>
  ),
};

export const NotFound404CustomProps: Story = {
  render: () => (
    <StorySection
      title="With custom props"
      description="Rendered within the app layout (navbar/sidebar), not a full-screen takeover like the 403 page — for now."
    >
      <div className="flex w-full p-24 justify-center">
        <Error404 message="Custom message" extra={<Button variant="outline">Custom button</Button>} />
      </div>
    </StorySection>
  ),
};
