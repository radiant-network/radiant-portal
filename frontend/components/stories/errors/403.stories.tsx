import type { Meta, StoryObj } from '@storybook/react-vite';

import Error403 from '@/components/base/errors/403';
import { Button } from '@/components/base/shadcn/button';

import { StorySection } from '../story-section';

const meta = {
  title: 'Layout/Page Error/403',
  component: Error403,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Authenticated but lacks tenant access',
      },
    },
  },
} satisfies Meta<typeof Error403>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Forbidden403: Story = {
  render: () => (
    <StorySection title="Forbidden - error 403">
      <Error403 />
    </StorySection>
  ),
};

export const Forbidden403CustomProps: Story = {
  render: () => (
    <StorySection title="With custom props">
      <Error403
        title="Custom title"
        message="Custom message"
        extra={
          <Button variant="outline" className="w-full">
            Custom button
          </Button>
        }
      />
    </StorySection>
  ),
};
