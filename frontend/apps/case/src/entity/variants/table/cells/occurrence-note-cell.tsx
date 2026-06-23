import { useCallback, useState } from 'react';
import useSWRMutation from 'swr/mutation';

import { Count } from '@/api/api';
import { useDataTable } from '@/components/base/data-table/hooks/use-data-table';
import { NotesProvider } from '@/components/base/notes/hooks/use-notes';
import { GetOccurrenceNoteInput } from '@/components/base/notes/notes-container';
import NotesPopover from '@/components/base/notes/notes-popover';
import { useTenant } from '@/components/hooks/use-tenant';
import { occurencesNotesApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

type VariantNoteCellProps = {
  seqId: number;
  taskId: number;
  occurrenceId: string;
  hasNote: boolean;
};

async function fetchNotesCount(_url: string, { arg }: { arg: GetOccurrenceNoteInput }, tenant: string) {
  const response = await occurencesNotesApi.countOccurrenceNotes(
    tenant,
    arg.caseId,
    arg.seqId,
    arg.taskId,
    arg.occurrenceId,
  );
  return response.data;
}

function OccurrenceNoteCell({ seqId, taskId, occurrenceId, hasNote }: VariantNoteCellProps) {
  const caseId = useCaseIdFromParam();
  const { tenant } = useTenant();
  const { list } = useDataTable();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { trigger } = useSWRMutation<Count, Error, string, GetOccurrenceNoteInput>(
    `list/notes/cout/${caseId}/${seqId}/${taskId}/${occurrenceId}`,
    (key, opts) => fetchNotesCount(key, opts, tenant),
  );

  const onChangeCallback = useCallback(async () => {
    setIsLoading(true);
    trigger({
      caseId,
      seqId,
      taskId,
      occurrenceId,
    }).then(() => {
      list?.mutate().then(() => setIsLoading(false));
    });
  }, [caseId, seqId, taskId, occurrenceId, list]);

  return (
    <NotesProvider value={{ onChangeCallback }}>
      <NotesPopover
        caseId={caseId}
        seqId={seqId}
        taskId={taskId}
        occurrenceId={occurrenceId}
        hasNotes={hasNote}
        loading={isLoading}
      />
    </NotesProvider>
  );
}

export default OccurrenceNoteCell;
