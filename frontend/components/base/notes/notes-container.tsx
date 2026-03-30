import { useCallback, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { ApiError, CreateOccurrenceNoteInput, OccurrenceNote } from '@/api/api';
import RichTextEditor, {
  isEditorHasEmptyContent,
} from '@/components/base/data-entry/rich-text-editor/rich-text-editor';
import EmptyNoteIcon from '@/components/base/icons/empty-note-icon';
import { Button } from '@/components/base/shadcn/button';
import { TooltipProvider } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useLoginContext } from '@/components/hooks/use-login';
import { occurencesNotesApi } from '@/utils/api';

import { useNotesContext } from './hooks/use-notes';
import Note from './note';
import NoteSkeleton from './note-skeleton';

/*
 * occurence_id = locus_id for SNV
 * occurence_id = cnv_id for CNV
 */
type NoteContainerBaseProps = {
  caseId: number;
  seqId: number;
  taskId: number;
  occurenceId: string;
};

export type NotesContainerProps = NoteContainerBaseProps & {
  enableEmptyIcon?: boolean;
};

export type GetOccurrenceNoteInput = Omit<NotesContainerProps, 'enableEmptyIcon'>;

async function fetchNotes(input: GetOccurrenceNoteInput) {
  const response = await occurencesNotesApi.getOccurrenceNotes(
    input.caseId,
    input.seqId,
    input.taskId,
    input.occurenceId,
  );
  return response.data;
}

async function saveNote(_url: string, { arg }: { arg: CreateOccurrenceNoteInput }) {
  const response = await occurencesNotesApi.postOccurrenceNote(arg);
  return response.data;
}

/**
 * Display new comment rich-text-editor and all comment on a variant
 *
 * - ListFetcher refresh the table list when a note is saved or deleted to update the note's icon state
 */
function NotesContainer({ enableEmptyIcon = false, ...props }: NotesContainerProps) {
  const { t } = useI18n();
  const { sub } = useLoginContext();
  const { onChangeCallback } = useNotesContext();
  const [content, setContent] = useState<string>('');
  const [clearContent, setClearContent] = useState<boolean>(false);
  const save = useSWRMutation('notes/save', saveNote);
  const fetcher = useSWR<OccurrenceNote[], ApiError, GetOccurrenceNoteInput>(
    {
      caseId: props.caseId,
      seqId: props.seqId,
      taskId: props.taskId,
      occurenceId: props.occurenceId,
    },
    fetchNotes,
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    },
  );

  /**
   * Save a new note
   */
  const handleSave = useCallback(async () => {
    save
      .trigger({
        case_id: props.caseId,
        seq_id: props.seqId,
        task_id: props.taskId,
        occurrence_id: props.occurenceId,
        content,
      })
      .then(() => {
        setClearContent(true);
        setContent('');
        fetcher.mutate().then(() => {
          setClearContent(false);
          onChangeCallback();
        });
      });
  }, [content, props]);

  /**
   * Callback used by Note component to refresh list
   * when a note is deleted or edited
   */
  const handleChanged = useCallback(async () => fetcher.mutate(), []);

  return (
    <>
      <div className="px-4 py-3 shrink-0">
        <RichTextEditor
          onChange={setContent}
          clearContent={clearContent}
          editable={!save.isMutating}
          autofocus
          resisizable={false}
          actions={[
            <Button
              key="save"
              size="xxs"
              onClick={handleSave}
              loading={save.isMutating}
              disabled={isEditorHasEmptyContent(content)}
            >
              {t('common.save')}
            </Button>,
          ]}
        />
      </div>
      <TooltipProvider>
        <div className="flex-1 overflow-y-auto">
          {fetcher.isLoading && new Array(3).fill(0).map((_, index) => <NoteSkeleton key={index} />)}
          {enableEmptyIcon && !fetcher.isLoading && fetcher.data?.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-6">
              <EmptyNoteIcon />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground">{t('notes.variant.empty_title')}</p>
                <p className="text-sm text-muted-foreground">{t('notes.variant.empty_description')}</p>
              </div>
            </div>
          )}
          {(fetcher.data ?? []).map((note: OccurrenceNote) => (
            <Note key={note.id} {...note} isOwner={note.user_id === sub} onChanged={handleChanged} />
          ))}
        </div>
      </TooltipProvider>
    </>
  );
}

export default NotesContainer;
