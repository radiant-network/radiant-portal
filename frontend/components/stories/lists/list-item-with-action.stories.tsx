import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import List from '@/components/base/list/list';
import ListItemWithAction from '@/components/base/list/list-item-with-action';

const meta = {
  title: 'Lists/ListItem with action',
  component: ListItemWithAction,
  args: {
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    onShare: action('onShare'),
    onClick: action('onClick'),
  },
} satisfies Meta<typeof ListItemWithAction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Title',
    description: 'Description',
  },
  render: args => (
    <div className="max-w-[450px]">
      <List bordered>
        <ListItemWithAction {...args} />
        <ListItemWithAction {...args} />
        <ListItemWithAction {...args} />
        <ListItemWithAction {...args} />
      </List>
    </div>
  ),
};
