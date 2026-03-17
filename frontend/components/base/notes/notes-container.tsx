import axios from 'axios';
import useSWR from 'swr';

import RichTextEditor from '@/components/base/data-entry/rich-text-editor/rich-text-editor';
import EmptyNoteIcon from '@/components/base/icons/empty-note-icon';
import { Button } from '@/components/base/shadcn/button';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { TooltipProvider } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useLoginContext } from '@/components/hooks/use-login';

import Note, { NoteProps } from './note';

export type NotesContainerProps = {
  type: string;
  caseId: string;
  seqId: string;
  taskId: string;
  locusId: string;
  enableEmptyIcon?: boolean;
};

/**
 * TODO: Replace with api
 */
async function fetchNotes(input: NotesContainerProps) {
  return await axios
    .post(`api/notes/${input.type}/${input.caseId}/${input.seqId}/${input.taskId}/${input.locusId}`)
    .then(response => response.data);
}

function NoteSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      <div className="flex gap-4 items-center">
        <Skeleton className="size-6 shrink-0 rounded-full" />
        <Skeleton className="h-6 w-full" />
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function NotesContainer({ enableEmptyIcon = false, ...props }: NotesContainerProps) {
  const { sub } = useLoginContext();
  const { t } = useI18n();
  const { data, isLoading } = useSWR<NoteProps[]>(props, fetchNotes, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    shouldRetryOnError: false,
  });

  return (
    <>
      <div className="px-4 py-3 shrink-0">
        <RichTextEditor
          actions={[
            <Button key="save" size="xxs">
              {t('common.save')}
            </Button>,
          ]}
        />
      </div>
      <TooltipProvider>
        <div className="flex-1 overflow-y-auto">
          {isLoading && <NoteSkeleton />}
          {enableEmptyIcon && !isLoading && data?.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-6">
              <EmptyNoteIcon />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground">{t('notes.variant.empty_title')}</p>
                <p className="text-sm text-muted-foreground">{t('notes.variant.empty_description')}</p>
              </div>
            </div>
          )}
          {(data ?? []).map((note: NoteProps, index: number) => (
            <Note key={index} {...note} isOwner={note.user.id === sub} />
          ))}
        </div>
      </TooltipProvider>
    </>
  );
}

export default NotesContainer;
