/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from '@/components/base/shadcn/progress';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: {
    value: 50,
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

const WIDTH = 320;
const VALUES = [100, 75, 50, 25, 0];
const STEP_DELAY = 500;

export const Default: Story = {
  render: args => (
    <div style={{ width: WIDTH }}>
      <Progress {...args} aria-label="Progress" />
    </div>
  ),
};

export const Values: Story = {
  render: () => (
    <StorySection title="Values">
      <div className="flex flex-col gap-6" style={{ width: WIDTH }}>
        {VALUES.map(value => (
          <div key={value} className="flex flex-col gap-2">
            <StoryLabel>{value}%</StoryLabel>
            <Progress value={value} aria-label={`Progress ${value}%`} />
          </div>
        ))}
      </div>
    </StorySection>
  ),
};

export const Animated: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => setValue(current => (current >= 100 ? 0 : current + 25)), STEP_DELAY);
      return () => clearInterval(timer);
    }, []);

    return (
      <StoryShowcase>
        <StorySection title="Animated" description="The bar loops from 0 to 100% to show the transition.">
          <div style={{ width: WIDTH }}>
            <Progress value={value} aria-label="Loading" />
          </div>
        </StorySection>
      </StoryShowcase>
    );
  },
};
