import { GermlineSNVOccurrence } from '@/api/api';
import { useVariantComments } from '@/components/base/variant-comments/use-variant-comments';
import VariantCommentsPopover from '@/components/base/variant-comments/variant-comments-popover';

type CommentCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function CommentCell({ occurrence }: CommentCellProps) {
  const hasComments = (occurrence as any).has_comments === true;
  const { comments, addComment, updateComment, deleteComment, currentUser } = useVariantComments();

  return (
    <VariantCommentsPopover
      hasComments={hasComments}
      comments={comments}
      currentUserId={currentUser.id}
      onAdd={addComment}
      onUpdate={updateComment}
      onDelete={deleteComment}
    />
  );
}

export default CommentCell;
