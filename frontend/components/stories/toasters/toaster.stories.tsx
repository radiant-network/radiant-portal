import { Button } from '@/components/base/ui/button';
import { toast } from 'sonner';
import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from '@/components/base/ui/sonner';

const meta = {
  title: 'Toasters/Toaster',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
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
    );
  },
};
