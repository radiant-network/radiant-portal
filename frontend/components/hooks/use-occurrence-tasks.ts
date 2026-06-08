import useSWR from 'swr';

import { CaseTasksWithOccurrencesDataTypeEnum, TaskOccurrenceType } from '../../api/api';
import { caseApi, DEFAULT_TENANT } from '../../utils/api';

/**
 * Fetch every task attached to the given (case, sequencing) pair that produces
 * occurrences of the requested data type. Powers the Variants tab task dropdown.
 */
export function useOccurrenceTasks(caseId: number, seqId: number, dataType: CaseTasksWithOccurrencesDataTypeEnum) {
  const { data, isLoading, error } = useSWR<TaskOccurrenceType[]>(
    ['occurrence-tasks', caseId, seqId, dataType],
    async () => {
      const response = await caseApi.caseTasksWithOccurrences(DEFAULT_TENANT, caseId, seqId, dataType);
      return response.data;
    },
    { revalidateOnFocus: false },
  );

  return {
    tasks: data ?? [],
    isLoading,
    hasNoTask: !isLoading && !error && data !== undefined && data.length === 0,
    error,
  };
}
