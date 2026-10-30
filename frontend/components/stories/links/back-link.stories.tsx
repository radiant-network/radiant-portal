import { BrowserRouter } from 'react-router';
import type { Meta, StoryObj } from '@storybook/react-vite';

import BackLink from '@/components/base/navigation/back-link';

import { StoryLabel, StorySection } from '../story-section';

const meta = {
  title: 'Components/Links/Back Link',
  component: BackLink,
  args: {
    to: '/patient',
    children: 'Patients',
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof BackLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <StorySection
      title="Back link"
      description="Chevron and label on desktop; below the md breakpoint, only the chevron in a 28×28 target. Resize the window to see the mobile version."
    >
      <div className="flex items-center gap-8">
        <div className="flex flex-col gap-2">
          <StoryLabel>Default</StoryLabel>
          <BackLink {...args} />
        </div>
        <div className="flex flex-col gap-2">
          <StoryLabel>Hover (simulated)</StoryLabel>
          <BackLink {...args} className="text-foreground" />
        </div>
      </div>
    </StorySection>
  ),
};
