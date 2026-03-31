import { useCallback, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import useSWRMutation from 'swr/mutation';

import { OccurrenceNote, UpdateOccurrenceNoteInput } from '@/api/api';
import { SingleAvatar } from '@/components/base/assignation/avatar/single-avatar';
import RichTextEditor, {
  isEditorHasEmptyContent,
} from '@/components/base/data-entry/rich-text-editor/rich-text-editor';
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
import { formatRelativeByCurrentTime } from '@/components/lib/date';
import { occurencesNotesApi } from '@/utils/api';

import { useNotesContext } from './hooks/use-notes';
import NoteSkeleton from './note-skeleton';

export type NoteProps = OccurrenceNote & {
  isOwner: boolean;
  onChanged: () => Promise<OccurrenceNote[] | undefined>;
};

type PutOccurrenceNoteInput = UpdateOccurrenceNoteInput & {
  id: string;
};

async function updateNote(_url: string, { arg }: { arg: PutOccurrenceNoteInput }) {
  const response = await occurencesNotesApi.putOccurrenceNote(arg.id, { content: arg.content });
  return response.data;
}

async function deleteNote(_url: string, { arg }: { arg: string }) {
  const response = await occurencesNotesApi.deleteOccurrenceNote(arg);
  return response.data;
}

function Note({ id, user_id, user_name, created_at, updated_at, content, isOwner, onChanged }: NoteProps) {
  const { t } = useI18n();
  const { onChangeCallback } = useNotesContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(content);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { trigger: triggerDelete } = useSWRMutation(`note/delete/${id}`, deleteNote);
  const { trigger: triggerUpdate } = useSWRMutation(`note/update/${id}`, updateNote);

  const changedCallback = useCallback(async () => {
    onChanged().then(() => {
      setIsLoading(false);
    });
  }, [onChanged]);

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
        onClick: async () => {
          setIsLoading(true);
          triggerDelete(id).then(() => {
            onChangeCallback();
            changedCallback();
          });
        },
      },
    });
  }, []);

  const handleSaveEdit = useCallback(async () => {
    setIsEditing(false);
    setIsLoading(true);
    triggerUpdate({ id, content: editedContent }).then(changedCallback);
  }, [id, editedContent, onChanged]);

  const handleActiveEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEditing = useCallback(() => {
    setEditedContent(content);
    setIsEditing(false);
  }, []);

  if (isLoading) {
    return <NoteSkeleton />;
  }

  if (isEditing) {
    return (
      <div className="px-4 py-3">
        <RichTextEditor
          autofocus
          value={content}
          onChange={setEditedContent}
          resisizable={false}
          className="min-h-15 max-h-c50 resize-none"
          actions={[
            <Button key="cancel" variant="outline" size="xxs" onClick={handleCancelEditing}>
              {t('common.cancel')}
            </Button>,
            <Button key="save" size="xxs" onClick={handleSaveEdit} disabled={isEditorHasEmptyContent(editedContent)}>
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
        <SingleAvatar user={{ id: user_id, name: user_name }} size="md" />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">{user_name}</span>
          <span className="text-sm font-normal text-muted-foreground whitespace-nowrap">
            {formatRelativeByCurrentTime(t, created_at)}
            {created_at !== updated_at && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 cursor-default text-muted-foreground/70">{t('notes.variant.edited')}</span>
                </TooltipTrigger>
                <TooltipContent>{formatRelativeByCurrentTime(t, updated_at)}</TooltipContent>
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
                <DropdownMenuItem onClick={handleActiveEditing}>{t('common.edit')}</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <RichTextViewer value={content} />
      </div>
    </div>
  );
}

export default Note;
