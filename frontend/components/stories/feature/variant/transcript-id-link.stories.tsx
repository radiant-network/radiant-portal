import type { Meta, StoryObj } from '@storybook/react';
import TranscriptIdLink from '@/components/feature/variant/transcript-id-link';

const meta = {
  title: 'Feature/Variant/Transcript ID Link',
  component: TranscriptIdLink,
  args: {
    transcriptId: 'ENST00000367770',
    isCanonical: true,
  },
} satisfies Meta<typeof TranscriptIdLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    return <TranscriptIdLink {...args} />;
  },
};
