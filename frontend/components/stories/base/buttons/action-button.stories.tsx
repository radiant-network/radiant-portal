import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import ActionButton from "@/components/base/Buttons/ActionButton";
import { buttonColors, buttonVariants } from "./utils";

const meta = {
  title: "Base/Buttons/Action Button",
  component: ActionButton,
  tags: ["autodocs"],
  args: { onClick: fn(), size: "default", actions: [], onDefaultAction: fn() },
} satisfies Meta<typeof ActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {
    children: "Button",
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      {buttonColors.map((color) => {
        return (
          <div className="flex gap-2">
            {buttonVariants.map((variant) => (
              <ActionButton
                size="default"
                color={color}
                variant={variant}
                {...args}
              >
                {variant}
              </ActionButton>
            ))}
          </div>
        );
      })}
    </div>
  ),
};

export const Sizes: Story = {
  args: {
    children: "Button",
  },
  render: (args) => (
    <div className="flex gap-2">
      <ActionButton {...args} size="default" color="primary">
        Default
      </ActionButton>
      <ActionButton {...args} size="xs" color="primary">
        AButton xs
      </ActionButton>
      <ActionButton {...args} size="sm" color="primary">
        AButton sm
      </ActionButton>
      <ActionButton {...args} size="md" color="primary">
        AButton md
      </ActionButton>
      <ActionButton {...args} size="lg" color="primary">
        AButton lg
      </ActionButton>
    </div>
  ),
};
