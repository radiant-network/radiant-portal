import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { action } from "@storybook/addon-actions";

import MultiSelector from "@/components/base/multi-selector/multi-selector";
import { MultiSelectorOption } from "@/components/base/multi-selector/multi-selector.types";

const meta = {
  title: "Base/Data Entry/Inputs/Multi Selector",
  component: MultiSelector,
  args: {
    value: [],
    onChange: fn(),
    placeholder: "Placeholder",
  },
} satisfies Meta<typeof MultiSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultOptions: MultiSelectorOption[] = [
  { label: "Nextjs", value: "Nextjs" },
  { label: "Vite", value: "vite" },
  { label: "Nuxt", value: "nuxt", disable: true },
  { label: "Vue", value: "vue, disable: true", disable: true },
  { label: "Remix", value: "remix" },
  { label: "Svelte", value: "svelte", disable: true },
  { label: "Angular", value: "angular", disable: true },
  { label: "Ember", value: "ember", disable: true },
  { label: "React", value: "react" },
  { label: "Gatsby", value: "gatsby", disable: true },
  { label: "Astro", value: "astro", disable: true },
];

export const Default: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(["Nextjs"]);

    return (
      <MultiSelector
        value={values}
        onChange={(newValues) => {
          setValues(newValues);
          action("onChange")(newValues);
        }}
        className="max-w-[300px]"
        placeholder="Placeholder"
        commandProps={{
          className: "max-w-[300px]",
        }}
        defaultOptions={defaultOptions}
      />
    );
  },
};

export const AsyncSearch: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(["Nextjs"]);

    return (
      <MultiSelector
        value={values}
        onChange={(newValues) => {
          setValues(newValues);
          action("onChange")(newValues);
        }}
        onSearch={async (searchValue) => {
          action("onSearch")(searchValue);

          return new Promise((resolve) => {
            setTimeout(() => resolve(defaultOptions), 1000);
          });
        }}
        debounceDelay={300}
        className="max-w-[300px]"
        placeholder="Placeholder"
        commandProps={{
          className: "max-w-[300px]",
        }}
      />
    );
  },
};
