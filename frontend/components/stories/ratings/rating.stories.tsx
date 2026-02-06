import type { Meta, StoryObj } from '@storybook/react-vite';
import Rating from '@/components/base/rating';

const meta = {
  title: 'Ratings/Rating',
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
  render: args => <Rating {...args} />,
};
