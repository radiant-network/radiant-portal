import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/base/shadcn/button';
import { Spinner } from '@/components/base/shadcn/spinner';

const meta = {
  title: 'Spinner/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SpinnerVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h4>Sizes</h4>
      <div className="flex gap-4 items-center">
        <Spinner variant="loader2" className="size-3" />
        <Spinner variant="loader2" />
        <Spinner variant="loader2" className="size-5" />
        <Spinner variant="loader2" className="size-6" />
        <Spinner variant="loader2" className="size-8" />
      </div>
      <h4>Spinner inside Buttons</h4>
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
      <h4>Spinner custom</h4>
      <div className="flex gap-4 items-center">
        <Spinner variant="loader" />
      </div>
    </div>
  ),
};
