import { useState } from 'react';
import { formatDate } from 'date-fns';
import { EllipsisVertical } from 'lucide-react';

import { SingleAvatar } from '@/components/base/assignation/avatar/single-avatar';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { Button } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import CommentEditor from '@/components/base/variant-comments/comment-editor';
import { VariantComment } from '@/components/base/variant-comments/variant-comment.types';
import { useI18n } from '@/components/hooks/i18n';

type CommentItemProps = {
  comment: VariantComment;
  isOwner: boolean;
  onUpdate: (commentId: string, body: string) => void;
  onDelete: (commentId: string) => void;
};

function CommentItem({ comment, isOwner, onUpdate, onDelete }: CommentItemProps) {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);

  const isEdited = comment.updatedAt !== comment.createdAt;
  const formattedDate = formatDate(new Date(comment.createdAt), 'MMMM d, h:mm a');
  const formattedEditDate = isEdited ? formatDate(new Date(comment.updatedAt), 'MMMM d, h:mm a') : '';

  const handleDelete = () => {
    alertDialog.open({
      type: 'warning',
      title: t('variant_comments.delete_dialog.title'),
      description: t('variant_comments.delete_dialog.description'),
      cancelProps: {
        children: t('variant_comments.delete_dialog.cancel'),
      },
      actionProps: {
        color: 'destructive',
        children: t('variant_comments.delete_dialog.delete'),
        onClick: () => onDelete(comment.id),
      },
    });
  };

  const handleSaveEdit = (body: string) => {
    onUpdate(comment.id, body);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="px-4 py-3">
        <CommentEditor
          initialValue={comment.body}
          onSubmit={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
          submitLabel={t('variant_comments.save')}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="shrink-0">
        <SingleAvatar user={comment.author} size="md" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">{comment.author.name}</span>
          <span className="text-sm font-normal text-muted-foreground whitespace-nowrap">
            {formattedDate}
            {isEdited && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 cursor-default text-muted-foreground/70">{t('variant_comments.edited')}</span>
                </TooltipTrigger>
                <TooltipContent>{formattedEditDate}</TooltipContent>
              </Tooltip>
            )}
          </span>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="xxs" iconOnly className="ml-auto shrink-0">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  {t('variant_comments.actions.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  {t('variant_comments.actions.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div
          className="mt-1 text-sm text-foreground prose prose-sm max-w-none [&_p]:m-0 [&_ul]:my-1 [&_ol]:my-1"
          dangerouslySetInnerHTML={{ __html: comment.body }}
        />
      </div>
    </div>
  );
}

export default CommentItem;
