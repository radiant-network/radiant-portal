import type { Meta, StoryObj } from '@storybook/react-vite';

import ExpandableList from '@/components/base/list/expandable-list';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Lists/Expandable List',
  component: ExpandableList,
  args: {},
} satisfies Meta<typeof ExpandableList>;

export default meta;

type Story = StoryObj<typeof meta>;

const numberItems = [1, 2, 3, 4, 5, 6].map(item => <span key={item}>{item}</span>);

export const AllVariants: Story = {
  args: {
    visibleCount: 3,
    items: numberItems,
    emptyMessage: <>Empty</>,
  },
  render: args => (
    <StoryShowcase>
      <StorySection title="Default" description="Shows visibleCount items, then a “See more / See less” toggle.">
        <ExpandableList {...args} />
      </StorySection>

      <StorySection title="Sizes" description="Size controls the vertical spacing between items.">
        <div className="flex gap-12">
          {(['default', 'md', 'lg'] as const).map(size => (
            <div key={size} className="flex flex-col gap-2">
              <StoryLabel>{size}</StoryLabel>
              <ExpandableList size={size} visibleCount={3} items={numberItems} emptyMessage={<>Empty</>} />
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection title="Empty">
        <ExpandableList visibleCount={3} items={[]} emptyMessage={<span>List is Empty</span>} />
      </StorySection>
    </StoryShowcase>
  ),
};
