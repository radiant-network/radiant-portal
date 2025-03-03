import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import IconButton from "@/components/base/Buttons/IconButton";
import { HeartHandshakeIcon } from "lucide-react";

const meta = {
  title: "Base/Buttons/Icon Button",
  component: IconButton,
  tags: ["autodocs"],
  args: { onClick: fn(), size: "default" },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    variant: "default",
  },
};

export const Outline: Story = {
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    variant: "outline",
  },
};

export const Primary: Story = {
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    variant: "destructive",
  },
};

export const Loading: Story = {
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    variant: "primary",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    variant: "primary",
    disabled: true,
  },
};

export const Sizes: Story = {
  args: {
    icon: HeartHandshakeIcon,
  },
  render: (args) => (
    <div className="flex gap-2">
      <IconButton size="default" icon={args.icon} variant="primary" />
      <IconButton size="xs" icon={args.icon} variant="primary" />
      <IconButton size="sm" icon={args.icon} variant="primary" />
      <IconButton size="md" icon={args.icon} variant="primary" />
      <IconButton size="lg" icon={args.icon} variant="primary" />
    </div>
  ),
};
