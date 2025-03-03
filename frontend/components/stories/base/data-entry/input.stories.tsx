import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Input } from "@/components/base/ui/input";

const meta = {
  title: "Base/Data Entry/Input",
  component: Input,
  args: {
    value: "value",
    onChange: fn(),
    placeholder: "Placeholder",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="max-w-[300px]"
        placeholder="Placeholder"
        autoFocus
      />
    );
  },
};
