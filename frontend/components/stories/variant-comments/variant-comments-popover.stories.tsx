/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useVariantComments, useVariantCommentsEmpty } from '@/components/base/variant-comments/use-variant-comments';
import VariantCommentsPopover from '@/components/base/variant-comments/variant-comments-popover';

const meta = {
  title: 'Variant Comments/Comments Popover',
  component: VariantCommentsPopover,
} satisfies Meta<typeof VariantCommentsPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithComments: Story = {
  args: {} as any,
  render: () => {
    const { comments, addComment, updateComment, deleteComment, currentUser } = useVariantComments();

    return (
      <VariantCommentsPopover
        comments={comments}
        currentUserId={currentUser.id}
        onAdd={addComment}
        onUpdate={updateComment}
        onDelete={deleteComment}
      />
    );
  },
};

export const EmptyState: Story = {
  args: {} as any,
  render: () => {
    const { comments, addComment, updateComment, deleteComment, currentUser } = useVariantCommentsEmpty();

    return (
      <VariantCommentsPopover
        comments={comments}
        currentUserId={currentUser.id}
        onAdd={addComment}
        onUpdate={updateComment}
        onDelete={deleteComment}
      />
    );
  },
};
