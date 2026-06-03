import type { Meta, StoryObj } from '@storybook/react-vite';

import TranscriptIdLink from '@/components/base/variant/transcript-id-link';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Links/Transcript ID Link',
  component: TranscriptIdLink,
  args: {
    transcriptId: 'ENST00000367770',
    isCanonical: true,
    isManeSelect: false,
    isManePlus: false,
  },
} satisfies Meta<typeof TranscriptIdLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <StorySection title="Transcript ID link">
      <TranscriptIdLink {...args} />
    </StorySection>
  ),
};
