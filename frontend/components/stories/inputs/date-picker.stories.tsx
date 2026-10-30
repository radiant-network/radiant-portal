/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import type { Meta, StoryObj } from '@storybook/react-vite';

import type { DatePickerVariant } from '@/components/base/date/date-picker';
import DatePicker from '@/components/base/date/date-picker';
import DateRangePicker from '@/components/base/date/date-range-picker';
import TimeInput from '@/components/base/date/time-input';
import { Field, FieldLabel } from '@/components/base/shadcn/field';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Inputs/Date Picker',
  component: DatePicker,
  args: {
    onChange: () => {},
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

const WIDTH = 250;

const VARIANTS: { label: string; variant: DatePickerVariant }[] = [
  { label: 'Icon left', variant: 'icon-left' },
  { label: 'With input', variant: 'input' },
  { label: 'Icon right', variant: 'icon-right' },
  { label: 'Icon only', variant: 'icon' },
];

export const Variants: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <StorySection title="Variants" description="Hover, focus and open the pickers to see the other states.">
        <div className="flex flex-wrap gap-8">
          {VARIANTS.map(({ label, variant }) => (
            <div
              key={variant}
              className="flex flex-col gap-4"
              style={{ width: variant === 'icon' ? undefined : WIDTH }}
            >
              <StoryLabel>{label}</StoryLabel>
              <DatePicker variant={variant} value={date} onChange={setDate} />
              <DatePicker variant={variant} value={date} onChange={setDate} disabled />
            </div>
          ))}
        </div>
      </StorySection>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2026, 0, 20),
      to: new Date(2026, 1, 9),
    });

    return (
      <StorySection title="Date picker range">
        <DateRangePicker value={range} onChange={setRange} />
      </StorySection>
    );
  },
};

export const DateOfBirth: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <StoryShowcase direction="row">
        {(['icon-left', 'input'] as const).map(variant => (
          <StorySection key={variant} title={variant === 'input' ? 'With input' : 'Button'}>
            <Field style={{ width: WIDTH }}>
              <FieldLabel htmlFor={`date-of-birth-${variant}`}>Date of birth</FieldLabel>
              <DatePicker
                id={`date-of-birth-${variant}`}
                variant={variant}
                captionLayout="dropdown"
                value={date}
                onChange={setDate}
              />
            </Field>
          </StorySection>
        ))}
      </StoryShowcase>
    );
  },
};

export const DateAndTime: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <StorySection title="Date and time">
        <div className="flex gap-4">
          <Field style={{ width: WIDTH }}>
            <FieldLabel htmlFor="date-and-time-date">Date</FieldLabel>
            <DatePicker id="date-and-time-date" variant="icon-right" value={date} onChange={setDate} />
          </Field>
          <Field style={{ width: 140 }}>
            <FieldLabel htmlFor="date-and-time-time">Time</FieldLabel>
            <TimeInput id="date-and-time-time" defaultValue="10:30:00" />
          </Field>
        </div>
      </StorySection>
    );
  },
};

export const TimePicker: Story = {
  render: () => (
    <StorySection title="Time input">
      <div className="flex flex-col gap-4" style={{ width: 140 }}>
        <StoryLabel>Default</StoryLabel>
        <TimeInput defaultValue="10:30:00" />
        <StoryLabel>Disabled</StoryLabel>
        <TimeInput defaultValue="10:30:00" disabled />
      </div>
    </StorySection>
  ),
};
