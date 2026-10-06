import type { Meta, StoryObj } from '@storybook/react-vite';

import SkeletonCard from '@/components/base/cards/skeleton-card';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Cards/Skeleton Card',
  component: SkeletonCard,
  args: {
    title: 'Loading',
    rows: 3,
  },
} satisfies Meta<typeof SkeletonCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <StorySection title="Default">
      <div className="w-[350px]">
        <SkeletonCard {...args} />
      </div>
    </StorySection>
  ),
};

export const RowCounts: Story = {
  render: () => (
    <StorySection title="Row counts" description="Pick a row count that approximates the fields of the loaded card.">
      <div className="flex flex-col gap-6">
        {[1, 3, 4, 6].map(rows => (
          <div key={rows} className="w-[350px]">
            <SkeletonCard title={`${rows} ${rows === 1 ? 'row' : 'rows'}`} rows={rows} />
          </div>
        ))}
      </div>
    </StorySection>
  ),
};
