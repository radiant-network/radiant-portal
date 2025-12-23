import type { Meta, StoryObj } from '@storybook/react';

import ExpandableList from '@/components/base/list/expandable-list';

const meta = {
  title: 'Lists/Expandable List',
  component: ExpandableList,
  args: {},
} satisfies Meta<typeof ExpandableList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visibleCount: 3,
    items: [1, 2, 3, 4, 5, 6].map(item => <span key={item}>{item}</span>),
    emptyMessage: <>Empty</>,
  },
  render: args => (
    <div className="flex flex-col gap-8">
      {['default', 'md', 'lg'].map(size => (
        <div key={size}>
          <span>Size: {size}</span>
          <ExpandableList size={size} {...args} />
        </div>
      ))}
    </div>
  ),
};

export const Empty: Story = {
  args: {
    visibleCount: 3,
    items: [],
    emptyMessage: <span>List is Empty</span>,
  },
  render: args => <ExpandableList {...args} />,
};
