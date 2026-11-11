import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/base/shadcn/button';
import { Spinner } from '@/components/base/shadcn/spinner';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Spinners/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SpinnerVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Sizes">
        <div className="flex gap-4 items-center">
          <Spinner variant="loader2" className="size-3" />
          <Spinner variant="loader2" />
          <Spinner variant="loader2" className="size-5" />
          <Spinner variant="loader2" className="size-6" />
          <Spinner variant="loader2" className="size-8" />
        </div>
      </StorySection>

      <StorySection title="Spinner inside buttons">
        <div className="flex gap-4 items-center">
          <Button variant="default" iconOnly>
            <Spinner variant="loader2" className="size-6" />
          </Button>
          <Button variant="secondary" iconOnly>
            <Spinner variant="loader2" className="size-6" />
          </Button>
          <Button variant="ghost" iconOnly>
            <Spinner variant="loader2" className="size-6" />
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <Button variant="default">
            <Spinner variant="loader2" className="size-6" />
            Primary
          </Button>
          <Button variant="secondary">
            <Spinner variant="loader2" className="size-6" />
            Secondary
          </Button>
          <Button variant="ghost">
            <Spinner variant="loader2" className="size-6" />
            Ghost
          </Button>
        </div>
      </StorySection>

      <StorySection title="Spinner custom">
        <div className="flex gap-4 items-center">
          <Spinner variant="loader" />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};
