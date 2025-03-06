import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { action } from "@storybook/addon-actions";

import RichTextEditor from "@/components/base/rich-text-editor/rich-text-editor";

const meta = {
  title: "Base/Data Entry/RichText Editor",
  component: RichTextEditor,
  args: {
    value: "<h3>Hello</h3>",
    onChange: fn(),
    placeholder: "Placeholder",
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <RichTextEditor
        value={args.value}
        onChange={action("onChange")}
        onBlur={action("onBlur")}
        placeholder="Placeholder"
        wrapperClassName="max-w-[500px]"
        autoFocus
      />
    );
  },
};
