import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { TaskOccurrenceType } from '@/api/api';
import { CaseEntityTabs } from '@/components/cores/types/case-tabs';

type UseTaskIdSearchEffectProps = {
  tasks: TaskOccurrenceType[];
  isLoading: boolean;
};

/**
 * Keep the URL task_id in sync with the available task list.
 *
 * Waits for the fetch to complete, then:
 *  - clears task_id when no task exists for the current dataType (e.g. a stale
 *    task_id from a previously selected interface);
 *  - defaults to the first task when the current task_id is no longer part of
 *    the list (e.g. after changing sequencing experiment or interface).
 *
 * task_id drives both the occurrence table and the facets.
 */
export function useTaskIdSearchParamsEffect({ tasks, isLoading }: UseTaskIdSearchEffectProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('tab') !== CaseEntityTabs.Variants || isLoading) {
      return;
    }

    if (tasks.length === 0) {
      if (searchParams.has('task_id')) {
        searchParams.delete('task_id');
        setSearchParams(searchParams, { replace: true });
      }
      return;
    }

    const currentTaskId = Number(searchParams.get('task_id'));
    const validTaskIds = tasks.map(task => task.id);

    if (!validTaskIds.includes(currentTaskId)) {
      searchParams.set('task_id', `${tasks[0].id}`);
      setSearchParams(searchParams, { replace: true });
    }
  }, [tasks, isLoading, searchParams.get('tab')]);
}
