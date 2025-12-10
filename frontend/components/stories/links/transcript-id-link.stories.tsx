import type { Meta, StoryObj } from '@storybook/react';

import TranscriptIdLink from '@/components/base/variant/transcript-id-link';

const meta = {
  title: 'Links/Transcript ID Link',
  component: TranscriptIdLink,
  args: {
    transcriptId: 'ENST00000367770',
    isCanonical: true,
  },
} satisfies Meta<typeof TranscriptIdLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => <TranscriptIdLink {...args} />,
};
