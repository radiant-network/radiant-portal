import type { Meta, StoryObj } from '@storybook/react-vite';

import Rating from '@/components/base/rating';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Ratings/Rating',
  component: Rating,
  args: {
    starSize: 16,
    numberOfStars: 4,
    rating: 3,
  },
} satisfies Meta<typeof Rating>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <StorySection title="Rating">
      <Rating {...args} />
    </StorySection>
  ),
};
