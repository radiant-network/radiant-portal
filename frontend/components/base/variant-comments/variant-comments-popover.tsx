import { MessageSquare } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import CommentEditor from './comment-editor';
import CommentItem from './comment-item';
import CommentsEmptyIllustration from './comments-empty-illustration';
import { VariantComment } from './variant-comment.types';

type VariantCommentsPopoverProps = {
  hasComments: boolean;
  comments: VariantComment[];
  currentUserId: string;
  onAdd: (body: string) => void;
  onUpdate: (commentId: string, body: string) => void;
  onDelete: (commentId: string) => void;
};

function VariantCommentsPopover({
  hasComments,
  comments,
  currentUserId,
  onAdd,
  onUpdate,
  onDelete,
}: VariantCommentsPopoverProps) {
  const { t } = useI18n();
  const isEmpty = comments.length === 0;

  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button className="relative size-6" iconOnly variant="ghost">
                <MessageSquare
                  className={hasComments ? 'text-primary fill-primary/20' : 'text-muted-foreground/40'}
                  size={16}
                />
                {hasComments && (
                  <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none" />
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {hasComments ? t('variant.comments.tooltip.view') : t('variant.comments.tooltip.add')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent
        align="start"
        className="w-[420px] p-0 gap-0 flex flex-col max-h-[520px]"
        onFocusOutside={e => {
          if (document.querySelector('[role="alertdialog"]')) e.preventDefault();
        }}
        onInteractOutside={e => {
          if (document.querySelector('[role="alertdialog"]')) e.preventDefault();
        }}
      >
        <div className="px-4 py-3 shrink-0">
          <CommentEditor onSubmit={onAdd} />
        </div>

        <TooltipProvider>
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 px-4">
                <CommentsEmptyIllustration />
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-foreground">{t('variant_comments.empty_title')}</p>
                  <p className="text-sm text-muted-foreground">{t('variant_comments.empty_description')}</p>
                </div>
              </div>
            ) : (
              <div>
                {comments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    isOwner={comment.author.id === currentUserId}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
}

export default VariantCommentsPopover;
