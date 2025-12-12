import type { Meta, StoryObj } from '@storybook/react';
import { toast } from 'sonner';

import { Button } from '@/components/base/shadcn/button';
import { Toaster } from '@/components/base/shadcn/sonner';

const meta = {
  title: 'Toasters/Toaster',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Button
        onClick={() => {
          toast('Title', {
            description: 'A description',
          });
        }}
        color="primary"
      >
        Open Toaster
      </Button>
      <Toaster position="top-right" />
    </>
  ),
};
