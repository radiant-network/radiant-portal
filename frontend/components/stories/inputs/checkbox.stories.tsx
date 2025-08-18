import { useState } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Checkbox } from '@/components/base/ui/checkbox';

const meta = {
  title: 'Inputs/Checkbox',
  args: {
    size: 'default',
    checked: false,
    onCheckedChange: fn(),
  },
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);

    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  },
};

export const Sizes: Story = {
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);

    return (
      <>
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Size: default</h3>
          <Checkbox size="default" checked={checked} onCheckedChange={setChecked} />
        </div>
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Size: xs</h3>
          <Checkbox size="xs" checked={checked} onCheckedChange={setChecked} />
        </div>
      </>
    );
  },
};
