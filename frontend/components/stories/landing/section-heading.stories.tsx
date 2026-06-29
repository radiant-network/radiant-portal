import type { Meta, StoryObj } from '@storybook/react-vite';

import SectionHeading from '@/components/base/landing/section-heading';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Landing/Section Heading',
  component: SectionHeading,
  args: {
    title: 'Leading the way through data-sharing',
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Centered (default)">
        <SectionHeading title="Leading the way through data-sharing" />
      </StorySection>

      <StorySection title="With subtitle">
        <SectionHeading
          title="Advancing science through collaboration"
          subtitle="Easily gain access to a range of robust cloud-based resources to drive meaningful research progress."
        />
      </StorySection>

      <StorySection title="Left-aligned">
        <SectionHeading title="Accelerating research" align="left" />
      </StorySection>
    </StoryShowcase>
  ),
};
