/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/base/shadcn/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/base/shadcn/dialog';

const meta = {
  title: 'Modals/Dialog',
  component: Dialog,
  args: {},
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: _args => {
    const [open, setOpen] = useState<boolean>(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button onClick={() => setOpen(true)}>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
              Slot (swap it with your content)
            </div>
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const Sizes: Story = {
  args: {},
  render: _args => {
    const [openSm, setOpenSm] = useState<boolean>(false);
    const [openMd, setOpenMd] = useState<boolean>(false);
    const [openLg, setOpenLg] = useState<boolean>(false);
    const [openXl, setOpenXl] = useState<boolean>(false);
    const [openFull, setOpenFull] = useState<boolean>(false);

    return (
      <div className="flex gap-4">
        <Dialog open={openSm} onOpenChange={setOpenSm}>
          <DialogTrigger>
            <Button onClick={() => setOpenSm(true)}>Open SM</Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Dialog Title SM</DialogTitle>
              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
                Slot (swap it with your content)
              </div>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setOpenSm(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openMd} onOpenChange={setOpenMd}>
          <DialogTrigger>
            <Button onClick={() => setOpenMd(true)}>Open MD / default</Button>
          </DialogTrigger>
          <DialogContent size="md">
            <DialogHeader>
              <DialogTitle>Dialog Title MD</DialogTitle>
              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
                Slot (swap it with your content)
              </div>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setOpenMd(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openLg} onOpenChange={setOpenLg}>
          <DialogTrigger>
            <Button onClick={() => setOpenLg(true)}>Open LG</Button>
          </DialogTrigger>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Dialog Title LG</DialogTitle>
              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
                Slot (swap it with your content)
              </div>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setOpenLg(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openXl} onOpenChange={setOpenXl}>
          <DialogTrigger>
            <Button onClick={() => setOpenXl(true)}>Open XL</Button>
          </DialogTrigger>
          <DialogContent size="xl">
            <DialogHeader>
              <DialogTitle>Dialog Title XL</DialogTitle>
              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
                Slot (swap it with your content)
              </div>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setOpenXl(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openFull} onOpenChange={setOpenFull}>
          <DialogTrigger>
            <Button onClick={() => setOpenFull(true)}>Open Full</Button>
          </DialogTrigger>
          <DialogContent size="full">
            <DialogHeader>
              <DialogTitle>Dialog Title Full</DialogTitle>
              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
                Slot (swap it with your content)
              </div>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setOpenFull(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

export const StickyHeader: Story = {
  args: {},
  render: _args => {
    const [open, setOpen] = useState<boolean>(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button onClick={() => setOpen(true)}>Open</Button>
        </DialogTrigger>
        <DialogContent variant="stickyHeader" className="h-[300px]">
          <DialogHeader className="sticky top-0">
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <div className="overflow-auto">
            <DialogBody>
              <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
                Slot (swap it with your content)
              </div>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
};

export const StickyFooter: Story = {
  args: {},
  render: _args => {
    const [open, setOpen] = useState<boolean>(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button onClick={() => setOpen(true)}>Open</Button>
        </DialogTrigger>
        <DialogContent variant="stickyFooter" className="h-[300px]">
          <div className="overflow-auto">
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56">
                Slot (swap it with your content)
              </div>
            </DialogBody>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const StickyBoth: Story = {
  args: {},
  render: _args => {
    const [open, setOpen] = useState<boolean>(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button onClick={() => setOpen(true)}>Open</Button>
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
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
