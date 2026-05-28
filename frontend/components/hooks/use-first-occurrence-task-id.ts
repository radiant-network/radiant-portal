import { CaseTasksWithOccurrencesDataTypeEnum } from '../../api/api';

import { useOccurrenceTasks } from './use-occurrence-tasks';

/**
 * Resolve the first task attached to the given (case, sequencing) pair that
 * produces occurrences of the requested data type.
 *
 * Used where there is no task picker (e.g. the Variant entity case sliders, which
 * are bound to a single case row); the Variants tab itself lets the user pick
 * among multiple matching tasks. Callers gate occurrence requests on a defined
 * `taskId`.
 */
export function useFirstOccurrenceTaskId(
  caseId: number,
  seqId: number,
  dataType: CaseTasksWithOccurrencesDataTypeEnum,
) {
  const { tasks, isLoading, hasNoTask, error } = useOccurrenceTasks(caseId, seqId, dataType);

  return {
    taskId: tasks.length > 0 ? tasks[0].id : undefined,
    isLoading,
    hasNoTask,
    error,
  };
}
