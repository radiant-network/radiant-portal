import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Checkbox } from '@/components/base/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';

const meta = {
  title: 'Data Entry/Checkbox',
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
      <div className="flex gap-2">
        <Checkbox size="default" checked={checked} onCheckedChange={setChecked} />
        <Checkbox size="xs" checked={checked} onCheckedChange={setChecked} />
        <Checkbox size="sm" checked={checked} onCheckedChange={setChecked} />
        <Checkbox size="md" checked={checked} onCheckedChange={setChecked} />
        <Checkbox size="lg" checked={checked} onCheckedChange={setChecked} />
      </div>
    );
  },
};
