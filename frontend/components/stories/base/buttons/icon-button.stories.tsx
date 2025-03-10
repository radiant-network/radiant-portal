import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import IconButton from "@/components/base/Buttons/IconButton";
import { HeartHandshakeIcon } from "lucide-react";
import { buttonColors, buttonVariants } from "./utils";

const meta = {
  title: "Base/Buttons/Icon Button",
  component: IconButton,
  tags: ["autodocs"],
  args: { onClick: fn(), size: "default" },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {
    icon: HeartHandshakeIcon,
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      {buttonColors.map((color) => {
        return (
          <div className="flex gap-2">
            {buttonVariants.map((variant) => (
              <IconButton icon={args.icon} color={color} variant={variant} />
            ))}
          </div>
        );
      })}
    </div>
  ),
};

export const Sizes: Story = {
  args: {
    icon: HeartHandshakeIcon,
  },
  render: (args) => (
    <div className="flex gap-2">
      <IconButton color="primary" size="default" icon={args.icon} />
      <IconButton color="primary" size="xs" icon={args.icon} />
      <IconButton color="primary" size="sm" icon={args.icon} />
      <IconButton color="primary" size="md" icon={args.icon} />
      <IconButton color="primary" size="lg" icon={args.icon} />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    loading: true,
    color: "primary",
  },
};

export const Disabled: Story = {
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    disabled: true,
    color: "primary",
  },
};
