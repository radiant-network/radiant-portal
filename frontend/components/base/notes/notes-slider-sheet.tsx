import { useCallback, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import useSWR from 'swr';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/base/shadcn/sheet';
import { useI18n } from '@/components/hooks/i18n';
import { occurencesNotesApi } from '@/utils/api';

import { Button } from '../shadcn/button';
import { Spinner } from '../shadcn/spinner';

import NotesContainer, { NotesContainerProps } from './notes-container';

type NotesSliderProps = NotesContainerProps;

async function fetchNotesCount(input: NotesContainerProps) {
  const response = await occurencesNotesApi.countOccurrenceNotes(
    input.caseId,
    input.seqId,
    input.taskId,
    input.occurenceId,
  );
  return response.data;
}

function NotesSliderSheet({ ...props }: NotesSliderProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data, mutate, isLoading } = useSWR(
    `fetch-note-count-${props.caseId}-${props.seqId}-${props.taskId}-${props.occurenceId}`,
    () =>
      fetchNotesCount({
        seqId: props.seqId,
        caseId: props.caseId,
        taskId: props.taskId,
        occurenceId: props.occurenceId,
      }),
    {
      revalidateOnFocus: true,
    },
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    mutate();
  }, []);

  return (
    <div>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        <MessageSquare className="h-4 w-4" />
        {isLoading ? <Spinner /> : (data?.count ?? 0) > 0 && data?.count}
      </Button>
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent side="right" className="flex flex-col w-full sm:max-w-lg p-0 gap-0">
          <SheetHeader className="px-6 py-4">
            <SheetTitle>{t('notes.variant.title')}</SheetTitle>
            <SheetDescription className="sr-only">{t('notes.variant.title')}</SheetDescription>
          </SheetHeader>
          <NotesContainer {...props} enableEmptyIcon />
        </SheetContent>
      </Sheet>
    </div>
  );
}
export default NotesSliderSheet;
