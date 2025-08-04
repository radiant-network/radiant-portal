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
    items: [1, 2, 3, 4, 5, 6],
    renderItem: item => item as number,
  },
  render: args => {
    return <ExpandableList {...args} />;
  },
};
