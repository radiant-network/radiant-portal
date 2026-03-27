import { GermlineSNVOccurrence } from '@/api/api';
import { NotesProvider } from '@/components/base/notes/hooks/use-notes';
import NotesPopover from '@/components/base/notes/notes-popover';
import { useOccurrenceListContext } from '@/components/base/occurrence/hooks/use-occurrences-list';
import { useCaseIdFromParam } from '@/utils/helper';

type CNVNameCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function VariantNoteCell({ occurrence }: CNVNameCellProps) {
  const caseId = useCaseIdFromParam();
  const { mutate } = useOccurrenceListContext();
  const { seq_id, task_id, locus_id } = occurrence;

  return (
    <NotesProvider value={{ listFetcher: mutate }}>
      <NotesPopover
        caseId={caseId}
        seqId={seq_id}
        taskId={task_id}
        occurenceId={locus_id}
        hasNotes={occurrence.has_note}
      />
    </NotesProvider>
  );
}

export default VariantNoteCell;
