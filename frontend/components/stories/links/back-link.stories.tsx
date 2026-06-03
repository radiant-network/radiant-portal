import type { Meta, StoryObj } from '@storybook/react-vite';

import BackLink from '@/components/base/navigation/back-link';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Links/Back Link',
  component: BackLink,
  args: {},
} satisfies Meta<typeof BackLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <StorySection title="Back link">
      <BackLink>Back</BackLink>
    </StorySection>
  ),
};
