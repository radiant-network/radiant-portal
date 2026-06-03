/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from '@/components/base/shadcn/switch';

import { StoryLabel, StorySection } from '../story-section';

const meta = {
  title: 'Components/Inputs/Switch',
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
      <StorySection title="Sizes">
        <div className="flex items-center gap-2">
          <StoryLabel>Default</StoryLabel>
          <Switch size="default" checked={checkedDefault} onCheckedChange={setCheckedDefault} />
        </div>
        <div className="flex items-center gap-2">
          <StoryLabel>Small</StoryLabel>
          <Switch size="sm" checked={checkedSm} onCheckedChange={setCheckedSm} />
        </div>
      </StorySection>
    );
  },
};
