import type { StoryObj } from '@storybook/react';

import { cn } from '../../lib/utils';

const meta = {
  title: 'Theme/Colors',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="grid grid-cols-3 gap-4">
        <Color color="background" colorClass="bg-background" />
        <Color color="foreground" colorClass="bg-foreground" />
        <Color color="card" colorClass="bg-card" />
        <Color color="card foreground" colorClass="bg-card-foreground" />
        <Color color="popover" colorClass="bg-popover" />
        <Color color="popover foreground" colorClass="bg-popover-foreground" />
        <Color color="primary" colorClass="bg-primary" />
        <Color color="primary foreground" colorClass="bg-primary-foreground" />
        <Color color="secondary" colorClass="bg-secondary" />
        <Color color="secondary foreground" colorClass="bg-secondary-foreground" />
        <Color color="muted" colorClass="bg-muted" />
        <Color color="muted foreground" colorClass="bg-muted-foreground" />
        <Color color="accent" colorClass="bg-accent" />
        <Color color="accent foreground" colorClass="bg-accent-foreground" />
        <Color color="destructive" colorClass="bg-destructive" />
        <Color color="destructive foreground" colorClass="bg-destructive-foreground" />
        <Color color="border" colorClass="bg-border" />
        <Color color="input" colorClass="bg-input" />
        <Color color="ring" colorClass="bg-ring" />
        <Color color="sidebar foreground" colorClass="bg-sidebar-foreground" />
        <Color color="sidebar background" colorClass="bg-sidebar-background" />
        <Color color="sidebar primary" colorClass="bg-sidebar-primary" />
        <Color color="sidebar primary foreground" colorClass="bg-sidebar-primary-foreground" />
        <Color color="sidebar accent" colorClass="bg-sidebar-accent" />
        <Color color="sidebar accent foreground" colorClass="bg-sidebar-accent-foreground" />
        <Color color="sidebar border" colorClass="bg-sidebar-border" />
        <Color color="sidebar ring" colorClass="bg-sidebar-ring" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Color color="red" colorClass="bg-red" />
        <Color color="orange" colorClass="bg-orange" />
        <Color color="yellow" colorClass="bg-yellow" />
        <Color color="green" colorClass="bg-green" />
        <Color color="cyan" colorClass="bg-cyan" />
        <Color color="blue" colorClass="bg-blue" />
        <Color color="violet" colorClass="bg-violet" />
        <Color color="fuchsia" colorClass="bg-fuchsia" />
        <Color color="neutral" colorClass="bg-neutral" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Color color="bookmark amber" colorClass="bg-bookmark-amber" />
        <Color color="bookmark blue" colorClass="bg-bookmark-blue" />
        <Color color="bookmark green" colorClass="bg-bookmark-green" />
        <Color color="bookmark red" colorClass="bg-bookmark-red" />
        <Color color="bookmark off" colorClass="bg-bookmark-off" />
      </div>
    </div>
  ),
};

const Color = ({ color, colorClass }: { color: string; colorClass: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={cn('rounded-sm size-10 border', colorClass)} />
    <div className="text-sm text-center">{color}</div>
  </div>
);
