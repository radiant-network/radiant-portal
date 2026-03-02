/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/base/shadcn/button';
import { useVariantComments, useVariantCommentsEmpty } from '@/components/base/variant-comments/use-variant-comments';
import VariantCommentsSheet from '@/components/base/variant-comments/variant-comments-sheet';

const meta = {
  title: 'Variant Comments/Comments Sheet',
  component: VariantCommentsSheet,
} satisfies Meta<typeof VariantCommentsSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithComments: Story = {
  args: {} as any,
  render: () => {
    const [open, setOpen] = useState(false);
    const { comments, addComment, updateComment, deleteComment, currentUser } = useVariantComments();

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Variant Comments</Button>
        <VariantCommentsSheet
          open={open}
          onOpenChange={setOpen}
          comments={comments}
          currentUserId={currentUser.id}
          onAdd={addComment}
          onUpdate={updateComment}
          onDelete={deleteComment}
        />
      </>
    );
  },
};

export const EmptyState: Story = {
  args: {} as any,
  render: () => {
    const [open, setOpen] = useState(false);
    const { comments, addComment, updateComment, deleteComment, currentUser } = useVariantCommentsEmpty();

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Variant Comments (Empty)</Button>
        <VariantCommentsSheet
          open={open}
          onOpenChange={setOpen}
          comments={comments}
          currentUserId={currentUser.id}
          onAdd={addComment}
          onUpdate={updateComment}
          onDelete={deleteComment}
        />
      </>
    );
  },
};
