/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from '@/components/base/shadcn/switch';

const meta = {
  title: 'Inputs/Switch',
  args: {
    size: 'default',
    checked: false,
    onCheckedChange: () => {},
  },
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => {
    const [checkedDefault, setCheckedDefault] = useState(false);
    const [checkedSm, setCheckedSm] = useState(false);

    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <span className="">Default</span>
          <Switch size="default" checked={checkedDefault} onCheckedChange={setCheckedDefault} />
        </div>
        <div className="flex gap-2 items-center">
          <span className="">Small</span>
          <Switch size="sm" checked={checkedSm} onCheckedChange={setCheckedSm} />
        </div>
      </div>
    );
  },
};
