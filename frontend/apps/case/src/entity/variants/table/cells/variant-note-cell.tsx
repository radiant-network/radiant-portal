import { useCallback, useState } from 'react';
import useSWRMutation from 'swr/mutation';

import { Count, GermlineSNVOccurrence, SomaticSNVOccurrence } from '@/api/api';
import { NotesProvider } from '@/components/base/notes/hooks/use-notes';
import { GetOccurrenceNoteInput } from '@/components/base/notes/notes-container';
import NotesPopover from '@/components/base/notes/notes-popover';
import { occurencesNotesApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

type VariantNoteCellProps = {
  occurrence: GermlineSNVOccurrence | SomaticSNVOccurrence;
};

async function fetchNotesCount(_url: string, { arg }: { arg: GetOccurrenceNoteInput }) {
  const response = await occurencesNotesApi.countOccurrenceNotes(arg.caseId, arg.seqId, arg.taskId, arg.occurenceId);
  return response.data;
}

function VariantNoteCell({ occurrence }: VariantNoteCellProps) {
  const caseId = useCaseIdFromParam();
  const [hasNotes, setHasNotes] = useState<boolean>(occurrence.has_note);
  const { seq_id, task_id, locus_id } = occurrence;

  const { trigger } = useSWRMutation<Count, Error, string, GetOccurrenceNoteInput>(
    `list/notes/cout/${caseId}/${seq_id}/${task_id}/${locus_id}`,
    fetchNotesCount,
  );

  const onChangeCallback = useCallback(async () => {
    setHasNotes(true);
    trigger({
      caseId,
      seqId: seq_id,
      taskId: task_id,
      occurenceId: locus_id,
    }).then((value: Count) => {
      setHasNotes((value.count ?? 0) > 0);
    });
  }, [caseId, seq_id, task_id, locus_id]);

  return (
    <NotesProvider value={{ onChangeCallback }}>
      <NotesPopover caseId={caseId} seqId={seq_id} taskId={task_id} occurenceId={locus_id} hasNotes={hasNotes} />
    </NotesProvider>
  );
}

export default VariantNoteCell;
