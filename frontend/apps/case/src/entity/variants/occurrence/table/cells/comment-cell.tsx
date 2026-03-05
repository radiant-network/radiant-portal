import { GermlineSNVOccurrence } from '@/api/api';
import { useVariantComments } from '@/components/base/variant-comments/use-variant-comments';
import VariantCommentsPopover from '@/components/base/variant-comments/variant-comments-popover';

type CommentCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function CommentCell({ occurrence: _occurrence }: CommentCellProps) {
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
}

export default CommentCell;
