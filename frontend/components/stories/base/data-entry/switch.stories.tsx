import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Switch } from "@/components/base/ui/switch";

const meta = {
  title: "Base/Data Entry/Switch",
  tags: ["autodocs"],
  args: {
    size: "default",
    checked: false,
    onCheckedChange: fn(),
  },
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return <Switch checked={checked} onCheckedChange={setChecked} />;
  },
};

export const Sizes: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex gap-2">
        <Switch size="default" checked={checked} onCheckedChange={setChecked} />
        <Switch size="xs" checked={checked} onCheckedChange={setChecked} />
        <Switch size="sm" checked={checked} onCheckedChange={setChecked} />
        <Switch size="md" checked={checked} onCheckedChange={setChecked} />
        <Switch size="lg" checked={checked} onCheckedChange={setChecked} />
      </div>
    );
  },
};
