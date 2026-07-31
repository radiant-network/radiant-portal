/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from '@/components/base/shadcn/switch';

import { StoryLabel, StorySection } from '../story-section';

import { StoryErrorField } from './story-error-field';

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

export const ErrorState: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <StorySection
        title="Error"
        description="In error the switch gets a red border and the label turns red. Once on, the track stays primary — unlike the checkbox, which fills red."
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <StoryLabel>
              Off — the error clears once the switch is turned on, and comes back when it is turned off
            </StoryLabel>
            <StoryErrorField
              label="Enable notifications"
              error="This setting is required"
              layout="inline"
              invalid={!checked}
            >
              <Switch checked={checked} onCheckedChange={setChecked} aria-invalid={!checked} />
            </StoryErrorField>
          </div>

          <div className="flex flex-col gap-3">
            <StoryLabel>On while still in error</StoryLabel>
            <StoryErrorField label="Enable notifications" error="This setting is required" layout="inline">
              <Switch defaultChecked aria-invalid />
            </StoryErrorField>
          </div>
        </div>
      </StorySection>
    );
  },
};
