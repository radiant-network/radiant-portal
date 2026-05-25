import useSWR from 'swr';

import { CaseTasksWithOccurrencesDataTypeEnum } from '../../api/api';
import { caseApi } from '../../utils/api';

/**
 * Resolve the first task attached to the given (case, sequencing) pair that
 * produces occurrences of the requested data type.
 *
 * Returns the task id, a loading flag, and a flag indicating that the lookup
 * has resolved but no matching task exists. Callers gate occurrence requests
 * on a defined `taskId`.
 *
 * This is a temporary bridge: the Variants tab UX in the upcoming sub-task 3
 * will let users pick among multiple matching tasks. Until then, defaulting
 * to the first matching task preserves existing behavior.
 */
export function useFirstOccurrenceTaskId(
  caseId: number,
  seqId: number,
  dataType: CaseTasksWithOccurrencesDataTypeEnum,
) {
  const { data, isLoading, error } = useSWR(
    ['first-occurrence-task-id', caseId, seqId, dataType],
    async () => {
      const response = await caseApi.caseTasksWithOccurrences(caseId, seqId, dataType);
      return response.data;
    },
    { revalidateOnFocus: false },
  );

  return {
    taskId: data && data.length > 0 ? data[0].id : undefined,
    isLoading,
    hasNoTask: !isLoading && !error && data !== undefined && data.length === 0,
    error,
  };
}
