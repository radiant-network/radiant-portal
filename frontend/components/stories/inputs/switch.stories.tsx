/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, FieldError } from '@/components/base/shadcn/field';
import { Switch } from '@/components/base/shadcn/switch';
import SwitchField from '@/components/base/switches/switch-field';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

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

const label = 'Switch Text';
const description = 'This is a switch description.';

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

export const WithLabel: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Label, description and align">
        <div className="flex gap-20">
          <div className="flex flex-col gap-4" style={{ width: 280 }}>
            <StoryLabel>Default size</StoryLabel>
            <SwitchField label={label} description={description} />
            <SwitchField label={label} description={description} defaultChecked />
            <SwitchField label={label} description={description} align="end" />
            <SwitchField label={label} description={description} align="end" defaultChecked />
          </div>
          <div className="flex flex-col gap-4" style={{ width: 280 }}>
            <StoryLabel>Small size</StoryLabel>
            <SwitchField size="sm" label={label} description={description} />
            <SwitchField size="sm" label={label} description={description} defaultChecked />
            <SwitchField size="sm" label={label} description={description} align="end" />
            <SwitchField size="sm" label={label} description={description} align="end" defaultChecked />
          </div>
          <div className="flex flex-col gap-4" style={{ width: 280 }}>
            <StoryLabel>Label only</StoryLabel>
            <SwitchField label={label} />
            <SwitchField label={label} align="end" />
          </div>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};

export const Box: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Box">
        <div className="flex gap-20">
          <div className="flex flex-col gap-4" style={{ width: 280 }}>
            <StoryLabel>Default size</StoryLabel>
            <SwitchField box label={label} description={description} />
            <SwitchField box label={label} description={description} defaultChecked />
            <SwitchField box align="end" label={label} description={description} />
            <SwitchField box align="end" label={label} description={description} defaultChecked />
          </div>
          <div className="flex flex-col gap-4" style={{ width: 280 }}>
            <StoryLabel>Small size</StoryLabel>
            <SwitchField box size="sm" label={label} description={description} />
            <SwitchField box size="sm" label={label} description={description} defaultChecked />
            <SwitchField box size="sm" align="end" label={label} description={description} />
            <SwitchField box size="sm" align="end" label={label} description={description} defaultChecked />
          </div>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Disabled">
        <div className="flex gap-20">
          <div className="flex flex-col gap-4" style={{ width: 280 }}>
            <StoryLabel>Default</StoryLabel>
            <SwitchField disabled label={label} description={description} />
            <SwitchField disabled defaultChecked label={label} description={description} />
            <SwitchField disabled align="end" label={label} description={description} />
            <SwitchField disabled align="end" defaultChecked label={label} description={description} />
          </div>
          <div className="flex flex-col gap-4" style={{ width: 280 }}>
            <StoryLabel>Box</StoryLabel>
            <SwitchField box disabled label={label} description={description} />
            <SwitchField box disabled defaultChecked label={label} description={description} />
            <SwitchField box disabled align="end" label={label} description={description} />
            <SwitchField box disabled align="end" defaultChecked label={label} description={description} />
          </div>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};

export const ErrorState: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [fieldChecked, setFieldChecked] = useState(false);
    const [boxChecked, setBoxChecked] = useState(false);

    return (
      <StorySection title="Error">
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

          <div className="flex flex-col gap-3">
            <StoryLabel>Switch field</StoryLabel>
            <div className="flex gap-20">
              <div style={{ width: 280 }}>
                <Field>
                  <SwitchField
                    checked={fieldChecked}
                    onCheckedChange={setFieldChecked}
                    aria-invalid={!fieldChecked}
                    label={label}
                    description={description}
                  />
                  {!fieldChecked && <FieldError>This setting is required</FieldError>}
                </Field>
              </div>
              <div style={{ width: 280 }}>
                <Field>
                  <SwitchField
                    box
                    checked={boxChecked}
                    onCheckedChange={setBoxChecked}
                    aria-invalid={!boxChecked}
                    label={label}
                    description={description}
                  />
                  {!boxChecked && <FieldError>This setting is required</FieldError>}
                </Field>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <StoryLabel>Switch field on while still in error</StoryLabel>
            <div className="flex gap-20">
              <div style={{ width: 280 }}>
                <Field>
                  <SwitchField aria-invalid align="end" defaultChecked label={label} description={description} />
                  <FieldError>This setting is required</FieldError>
                </Field>
              </div>
              <div style={{ width: 280 }}>
                <Field>
                  <SwitchField box aria-invalid defaultChecked label={label} description={description} />
                  <FieldError>This setting is required</FieldError>
                </Field>
              </div>
              <div style={{ width: 280 }}>
                <Field>
                  <SwitchField box aria-invalid align="end" defaultChecked label={label} description={description} />
                  <FieldError>This setting is required</FieldError>
                </Field>
              </div>
            </div>
          </div>
        </div>
      </StorySection>
    );
  },
};
