/* eslint-disable react-hooks/rules-of-hooks */
import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { addDays } from 'date-fns';

import TimeInput from '@/components/base/date/time-input';
import { Button } from '@/components/base/shadcn/button';
import { Calendar, CalendarDayButton } from '@/components/base/shadcn/calendar';
import { Field, FieldLabel } from '@/components/base/shadcn/field';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Inputs/Calendar',
  component: Calendar,
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

// Fixed dates so the stories match the Figma mockups whatever the current day
const TODAY = new Date(2025, 0, 24);
const SELECTED = new Date(2025, 0, 10);
const RANGE: DateRange = { from: new Date(2025, 0, 12), to: new Date(2025, 1, 8) };

const BOX_CLASS = 'rounded-md border';

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'In a week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
];

const TIME_SLOTS = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00'];

export const Sizes: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(SELECTED);

    return (
      <StoryShowcase direction="row">
        {(['default', 'md'] as const).map(size => (
          <StorySection key={size} title={size === 'default' ? 'Default (28px)' : 'md (38px)'}>
            <Calendar
              size={size}
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={SELECTED}
              today={TODAY}
              className={BOX_CLASS}
            />
          </StorySection>
        ))}
      </StoryShowcase>
    );
  },
};

export const CaptionLayout: Story = {
  render: () => (
    <StoryShowcase direction="row">
      {(
        [
          { title: 'Label', layout: 'label' },
          { title: 'Month and year', layout: 'dropdown' },
          { title: 'Year only', layout: 'dropdown-years' },
          { title: 'Month only', layout: 'dropdown-months' },
        ] as const
      ).map(({ title, layout }) => (
        <StorySection key={layout} title={title}>
          <Calendar
            mode="single"
            captionLayout={layout}
            defaultMonth={SELECTED}
            today={TODAY}
            startMonth={new Date(2015, 0)}
            endMonth={new Date(2035, 11)}
            className={BOX_CLASS}
          />
        </StorySection>
      ))}
    </StoryShowcase>
  ),
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>(RANGE);

    return (
      <StoryShowcase>
        <StorySection title="2 months" description="Months stack vertically below the md breakpoint.">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={setRange}
            defaultMonth={RANGE.from}
            today={TODAY}
            className={BOX_CLASS}
          />
        </StorySection>
        <StorySection title="3 months">
          <Calendar
            mode="range"
            numberOfMonths={3}
            selected={range}
            onSelect={setRange}
            defaultMonth={RANGE.from}
            today={TODAY}
            className={BOX_CLASS}
          />
        </StorySection>
      </StoryShowcase>
    );
  },
};

export const DayStates: Story = {
  render: () => (
    <StoryShowcase direction="row">
      <StorySection title="Week numbers">
        <Calendar
          mode="single"
          showWeekNumber
          defaultMonth={SELECTED}
          today={TODAY}
          selected={SELECTED}
          className={BOX_CLASS}
        />
      </StorySection>
      <StorySection title="Booked" description="Booked days are disabled and struck through.">
        <Calendar
          mode="single"
          defaultMonth={SELECTED}
          today={TODAY}
          selected={SELECTED}
          disabled={{ from: new Date(2025, 0, 12), to: new Date(2025, 0, 20) }}
          modifiers={{ booked: { from: new Date(2025, 0, 12), to: new Date(2025, 0, 20) } }}
          modifiersStyles={{ booked: { textDecoration: 'line-through' } }}
          className={BOX_CLASS}
        />
      </StorySection>
      <StorySection title="Custom cell">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          defaultMonth={SELECTED}
          today={TODAY}
          selected={SELECTED}
          className={BOX_CLASS}
          style={{ '--cell-size': '3rem' } as CSSProperties}
          components={{
            DayButton: ({ children, ...props }) => (
              <CalendarDayButton {...props}>
                {children}
                <span>$100</span>
              </CalendarDayButton>
            ),
          }}
        />
      </StorySection>
    </StoryShowcase>
  ),
};

export const WithFooter: Story = {
  render: () => {
    const [presetDate, setPresetDate] = useState<Date | undefined>(new Date(2025, 8, 10));
    const [presetMonth, setPresetMonth] = useState<Date>(new Date(2025, 8, 10));
    const [timeDate, setTimeDate] = useState<Date | undefined>(new Date(2025, 8, 10));
    const [slotDate, setSlotDate] = useState<Date | undefined>(SELECTED);
    const [slot, setSlot] = useState<string>('10:00');

    return (
      <StoryShowcase direction="row">
        <StorySection title="Presets">
          <div className={BOX_CLASS}>
            <Calendar
              mode="single"
              selected={presetDate}
              onSelect={setPresetDate}
              month={presetMonth}
              onMonthChange={setPresetMonth}
              today={TODAY}
            />
            <div className="flex flex-col gap-2 border-t p-3">
              {[PRESETS.slice(0, 3), PRESETS.slice(3)].map(row => (
                <div
                  key={row[0].label}
                  className={row.length === 3 ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2'}
                >
                  {row.map(({ label, days }) => (
                    <Button
                      key={label}
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        const date = addDays(TODAY, days);
                        setPresetDate(date);
                        setPresetMonth(date);
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </StorySection>

        <StorySection title="Start and end time">
          <div className={BOX_CLASS}>
            <Calendar mode="single" selected={timeDate} onSelect={setTimeDate} defaultMonth={timeDate} today={TODAY} />
            <div className="flex flex-col gap-4 border-t p-3">
              <Field>
                <FieldLabel htmlFor="calendar-start-time">Start Time</FieldLabel>
                <TimeInput id="calendar-start-time" defaultValue="10:30:00" size="sm" />
              </Field>
              <Field>
                <FieldLabel htmlFor="calendar-end-time">End Time</FieldLabel>
                <TimeInput id="calendar-end-time" defaultValue="12:30:00" size="sm" />
              </Field>
            </div>
          </div>
        </StorySection>

        <StorySection title="Time slots">
          <div className={`flex ${BOX_CLASS}`}>
            <Calendar mode="single" selected={slotDate} onSelect={setSlotDate} defaultMonth={SELECTED} today={TODAY} />
            <div className="flex flex-col gap-2 border-l p-3">
              {TIME_SLOTS.map(time => (
                <Button
                  key={time}
                  variant={slot === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSlot(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </StorySection>
      </StoryShowcase>
    );
  },
};
