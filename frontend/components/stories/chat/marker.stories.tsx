import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info } from 'lucide-react';

import { Marker, MarkerContent, MarkerIcon } from '@/components/base/shadcn/marker';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Chat/Marker',
  component: Marker,
} satisfies Meta<typeof Marker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <StorySection title="Variants" description="Inline conversation markers: default, separator, border.">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Marker variant="default">
          <MarkerContent>Conversation started</MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>Today</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>Unread messages below</MarkerContent>
        </Marker>
      </div>
    </StorySection>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <StorySection title="With icon">
      <div className="w-full max-w-md">
        <Marker variant="default">
          <MarkerIcon>
            <Info />
          </MarkerIcon>
          <MarkerContent>The assistant updated its answer.</MarkerContent>
        </Marker>
      </div>
    </StorySection>
  ),
};
