import { Separator } from '@/components/base/shadcn/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/base/shadcn/sheet';
import { TooltipProvider } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import CommentEditor from './comment-editor';
import CommentItem from './comment-item';
import CommentsEmptyIllustration from './comments-empty-illustration';
import { VariantComment } from './variant-comment.types';

type VariantCommentsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comments: VariantComment[];
  currentUserId: string;
  onAdd: (body: string) => void;
  onUpdate: (commentId: string, body: string) => void;
  onDelete: (commentId: string) => void;
};

function VariantCommentsSheet({
  open,
  onOpenChange,
  comments,
  currentUserId,
  onAdd,
  onUpdate,
  onDelete,
}: VariantCommentsSheetProps) {
  const { t } = useI18n();
  const isEmpty = comments.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-[512px] p-0 gap-0">
        <SheetHeader className="px-6 py-4">
          <SheetTitle>{t('variant_comments.title')}</SheetTitle>
          <SheetDescription className="sr-only">{t('variant_comments.title')}</SheetDescription>
        </SheetHeader>
        <Separator />

        <div className="px-6 py-4">
          <CommentEditor onSubmit={onAdd} />
        </div>

        <TooltipProvider>
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 px-6">
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
      </SheetContent>
    </Sheet>
  );
}

export default VariantCommentsSheet;
