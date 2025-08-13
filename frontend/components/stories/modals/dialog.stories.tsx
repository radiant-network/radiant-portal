import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from '@/components/base/ui/dialog';
import { Button } from '@/components/base/ui/button';

const meta = {
  title: 'Modals/Dialog',
  component: Dialog,
  args: {},
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <Dialog>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
            Slot (swap it with your content)
          </div>
        </div>
        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const StickyHeader: Story = {
  args: {},
  render: args => (
    <Dialog>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent variant="stickyHeader" className="h-[300px]">
        <DialogHeader className="sticky top-0">
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogHeader>
        <div className="overflow-auto">
          <div className="px-6 py-4">
            <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
              Slot (swap it with your content)
            </div>
          </div>
          <DialogFooter>
            <Button>Close</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const StickyFooter: Story = {
  args: {},
  render: args => (
    <Dialog>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent variant="stickyFooter" className="h-[300px]">
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56">
              Slot (swap it with your content)
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const StickyBoth: Story = {
  args: {},
  render: args => (
    <Dialog>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent variant="stickyBoth" className="h-[300px]">
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogHeader>
        <div className="overflow-auto px-6 py-4">
          <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56">
            Slot (swap it with your content)
          </div>
        </div>
        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
