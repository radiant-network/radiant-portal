import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Button } from "@/components/base/ui/button";

const meta = {
  title: "Base/Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  args: { onClick: fn(), size: "default" },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "Button",
    variant: "outline",
  },
};

export const Primary: Story = {
  args: {
    children: "Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Button",
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    children: "Button",
    variant: "destructive",
  },
};

export const Link: Story = {
  args: {
    children: "Button",
    variant: "link",
  },
};

export const Loading: Story = {
  args: {
    children: "Button",
    variant: "primary",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Button",
    variant: "primary",
    disabled: true,
  },
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <div className="flex gap-2">
      <Button size="default" variant="primary">
        Default
      </Button>
      <Button size="xs" variant="primary">
        Button xs
      </Button>
      <Button size="sm" variant="primary">
        Button sm
      </Button>
      <Button size="md" variant="primary">
        Button md
      </Button>
      <Button size="lg" variant="primary">
        Button lg
      </Button>
    </div>
  ),
};
