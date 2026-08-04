/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { type CheckedState } from '@radix-ui/react-checkbox';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '@/components/base/shadcn/checkbox';

import { StoryLabel, StorySection } from '../story-section';

import { StoryErrorField } from './story-error-field';

const meta = {
  title: 'Components/Inputs/Checkbox',
  args: {
    size: 'default',
    checked: false,
    onCheckedChange: () => {},
  },
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);

    return (
      <StorySection title="Sizes">
        <div className="flex flex-col gap-2">
          <StoryLabel>default</StoryLabel>
          <Checkbox size="default" checked={checked} onCheckedChange={setChecked} />
        </div>
        <div className="flex flex-col gap-2">
          <StoryLabel>xs</StoryLabel>
          <Checkbox size="xs" checked={checked} onCheckedChange={setChecked} />
        </div>
      </StorySection>
    );
  },
};

export const ErrorState: Story = {
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);

    return (
      <StorySection
        title="Error"
        description="No red border on the box: by design, a checkbox in error shows the red label and the message only."
      >
        <StoryErrorField
          label="I accept the terms"
          error="You must accept the terms to continue"
          layout="inline"
          invalid={checked !== true}
        >
          <Checkbox checked={checked} onCheckedChange={setChecked} />
        </StoryErrorField>
      </StorySection>
    );
  },
};
