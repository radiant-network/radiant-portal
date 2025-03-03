import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import ActionButton from "@/components/base/Buttons/ActionButton";

const meta = {
  title: "Base/Buttons/Action Button",
  component: ActionButton,
  tags: ["autodocs"],
  args: { onClick: fn(), size: "default", actions: [], onDefaultAction: fn() },
} satisfies Meta<typeof ActionButton>;

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

export const Loading: Story = {
  args: {
    children: "Button",
    variant: "primary",
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
  args: {
    children: "Button",
  },
  render: (args) => (
    <div className="flex gap-2">
      <ActionButton {...args} size="default" variant="primary">
        Default
      </ActionButton>
      <ActionButton {...args} size="xs" variant="primary">
        AButton xs
      </ActionButton>
      <ActionButton {...args} size="sm" variant="primary">
        AButton sm
      </ActionButton>
      <ActionButton {...args} size="md" variant="primary">
        AButton md
      </ActionButton>
      <ActionButton {...args} size="lg" variant="primary">
        AButton lg
      </ActionButton>
    </div>
  ),
};
