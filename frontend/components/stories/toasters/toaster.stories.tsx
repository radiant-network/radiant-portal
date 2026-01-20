/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';
import { FlaskConicalIcon } from 'lucide-react';
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
    <div className="flex flex-col gap-4">
      <h4>Default Toaster</h4>
      <div className="flex gap-4 items-center">
        <Button
          onClick={() => {
            toast('Title');
          }}
          color="primary"
        >
          Title only
        </Button>
        <Button
          onClick={() => {
            toast('Title', {
              description: 'A description',
            });
          }}
          color="primary"
        >
          Title Desc
        </Button>
        <Button
          onClick={() => {
            toast('Title', {
              description: 'A description',
              icon: <FlaskConicalIcon className="size-5 text-foreground mt-1" />,
            });
          }}
          color="primary"
        >
          Custom icon
        </Button>
        <Button
          onClick={() => {
            toast('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
            });
          }}
          color="primary"
        >
          Title Desc Action
        </Button>
        <Button
          onClick={() => {
            toast('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
              closeButton: true,
            });
          }}
          color="primary"
        >
          Title Desc Action Close
        </Button>
        <Button
          onClick={() => {
            toast('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
              closeButton: true,
              icon: <FlaskConicalIcon className="size-5 text-foreground mt-1" />,
            });
          }}
          color="primary"
        >
          Full options
        </Button>
      </div>
      <h4>Feedback Toaster</h4>
      <div className="flex gap-4 items-center">
        <Button
          onClick={() => {
            toast.info('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
              closeButton: true,
            });
          }}
          color="primary"
        >
          Open Info Toaster
        </Button>
        <Button
          onClick={() => {
            toast.success('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
              closeButton: true,
            });
          }}
          color="primary"
        >
          Open Success Toaster
        </Button>
        <Button
          onClick={() => {
            toast.warning('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
              closeButton: true,
            });
          }}
          color="primary"
        >
          Open Warning Toaster
        </Button>
        <Button
          onClick={() => {
            toast.error('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
              closeButton: true,
            });
          }}
          color="primary"
        >
          Open Error Toaster
        </Button>
      </div>
      <h4>Promise Toaster</h4>
      <div className="flex gap-4 items-center">
        <Button
          onClick={() => {
            toast.promise<{ name: string }>(
              () => new Promise(resolve => setTimeout(() => resolve({ name: 'Event' }), 2000)),
              {
                loading: 'Loading...',
                success: data => `${data.name} has been created`,
                error: 'Error',
              },
            );
          }}
          color="primary"
        >
          Promise Toaster
        </Button>
      </div>
      <Toaster position="top-right" />
    </div>
  ),
};
