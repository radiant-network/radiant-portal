import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { action } from "@storybook/addon-actions";

import InputSearch from "@/components/base/input-search";

const meta = {
  title: "Base/Data Entry/Inputs/Input Search",
  component: InputSearch,
  args: {
    value: "Search value",
    onSearch: fn(),
    onChange: fn(),
    placeholder: "Placeholder",
    searchButtonProps: {},
  },
} satisfies Meta<typeof InputSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <InputSearch
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          action("onChange")(e);
        }}
        onSearch={(value) => {
          action("onSearch")(value);
        }}
        className="max-w-[300px]"
        placeholder="Placeholder"
        autoFocus
        searchButtonProps={{
          color: "primary",
          variant: "filled",
        }}
      />
    );
  },
};
