import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { action } from "@storybook/addon-actions";
import { useI18n } from "@/components/hooks/i18n";

import { Input } from "@/components/base/ui/input";

const meta = {
  title: "Base/Data Entry/Inputs/Input",
  component: Input,
  args: {
    value: "Input value",
    onChange: fn(),
    placeholder: "Placeholder",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const { t } = useI18n();

    return (
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          action("onChange")(e);
        }}
        className="max-w-[300px]"
        placeholder={t('common.input.placeholder')}
        autoFocus
      />
    );
  },
};
