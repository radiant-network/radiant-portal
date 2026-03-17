import { useCallback, useState } from 'react';
import { formatDate } from 'date-fns';
import { EllipsisVertical } from 'lucide-react';

import { AvatarUser } from '@/components/base/assignation/avatar';
import { SingleAvatar } from '@/components/base/assignation/avatar/single-avatar';
import RichTextViewer from '@/components/base/data-entry/rich-text-editor/rich-text-viewer';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { Button } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import RichTextEditor from '../data-entry/rich-text-editor/rich-text-editor';

export type NoteProps = {
  text: string;
  user: AvatarUser;
  updatedAt: string;
  createdAt: string;
  isOwner: boolean;
};

function Note({ user, createdAt, updatedAt, text, isOwner }: NoteProps) {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const handleDelete = useCallback(() => {
    alertDialog.open({
      type: 'warning',
      title: t('notes.variant.delete_dialog.title'),
      description: t('notes.variant.delete_dialog.description'),
      cancelProps: {
        children: t('common.cancel'),
      },
      actionProps: {
        color: 'destructive',
        children: t('common.delete'),
        onClick: () => {
          console.warn('Delete has not been implemented');
        },
      },
    });
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleSaveEdit = useCallback(() => {
    setIsEditing(false);
    console.warn('handleSaveEdit has not been implemented');
  }, []);

  if (isEditing) {
    return (
      <div className="px-4 py-3">
        <RichTextEditor
          autofocus
          value={text}
          // onChange={setValue}
          className="min-h-[60px] max-h-[200px] resize-none"
          actions={[
            <Button key="cancel" variant="outline" size="xxs" onClick={handleCancelEdit}>
              {t('common.cancel')}
            </Button>,
            <Button key="save" size="xxs" onClick={handleSaveEdit} disabled={text.length === 0}>
              {t('common.save')}
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="shrink-0">
        <SingleAvatar user={user} size="md" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">{user.name}</span>
          <span className="text-sm font-normal text-muted-foreground whitespace-nowrap">
            {formatDate(createdAt, t('common.date'))}
            {updatedAt && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 cursor-default text-muted-foreground/70">{t('notes.variant.edited')}</span>
                </TooltipTrigger>
                <TooltipContent>{formatDate(updatedAt, t('common.date'))}</TooltipContent>
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
                <DropdownMenuItem onClick={handleEdit}>{t('common.edit')}</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <RichTextViewer value={text} />
      </div>
    </div>
  );
}

export default Note;
