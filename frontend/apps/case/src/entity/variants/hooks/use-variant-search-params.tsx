import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { CaseEntity, TaskOccurrenceType } from '@/api/api';
import { CaseEntityTabs } from '@/components/cores/types/case-tabs';

/**
 * Utils function to setup default seqId value on load
 */
export function getDefaultSeqId(searchParamSeqId: string | null, caseEntity?: CaseEntity) {
  // only use sequencing experiments with variants
  const validSeqIds =
    caseEntity?.sequencing_experiments.filter(seqExp => seqExp.has_variants).map(seqExp => seqExp.seq_id) ?? [];

  let defaultSeqId = searchParamSeqId != null ? Number(searchParamSeqId) : -1;

  if (validSeqIds.length > 0 && !validSeqIds.includes(defaultSeqId)) {
    defaultSeqId = validSeqIds[0];
  }

  return defaultSeqId;
}

type UseVariantSearchParamsEffectProps = {
  seqId: number;
  setSeqId: (value: number) => void;
  caseEntity?: CaseEntity;
  tasks: TaskOccurrenceType[];
  isLoading: boolean;
};

/**
 * Keep the variant exploration URL params (`seq_id` and `task_id`) in sync with
 * the selected sequencing experiment and the available task list.
 *
 * - Derives the `seqId` state from the case entity when the current value is not
 *   a valid sequencing experiment.
 * - Writes `seq_id` and `task_id` together in a single setSearchParams call.
 *   Writing them from two separate effects raced (each based on its own render
 *   snapshot) and could drop `task_id` from the URL, which left the occurrence
 *   table and the facets unable to fetch.
 *
 * Once the task fetch has completed, task_id is:
 *  - cleared when no task exists for the current dataType (e.g. a stale task_id
 *    from a previously selected interface);
 *  - defaulted to the first task when the current task_id is no longer part of
 *    the list (e.g. after changing sequencing experiment or interface).
 *
 * seq_id / task_id drive both the occurrence table and the facets.
 */
export function useVariantSearchParamsEffect({
  seqId,
  setSeqId,
  caseEntity,
  tasks,
  isLoading,
}: UseVariantSearchParamsEffectProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive the selected seqId from the case entity.
  useEffect(() => {
    const searchParamSeqId = Number(searchParams.get('seq_id'));
    const validSeqIds =
      caseEntity?.sequencing_experiments.filter(seqExp => seqExp.has_variants).map(seqExp => seqExp.seq_id) ?? [];

    if (validSeqIds.length > 0 && !validSeqIds.includes(searchParamSeqId)) {
      setSeqId(validSeqIds[0]);
    }
  }, [caseEntity]);

  // Write seq_id + task_id together to avoid two effects racing on the URL.
  useEffect(() => {
    if (searchParams.get('tab') !== CaseEntityTabs.Variants) {
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.set('seq_id', `${seqId}`);

    // Only reconcile task_id once the task list has finished loading.
    if (!isLoading) {
      if (tasks.length === 0) {
        next.delete('task_id');
      } else {
        const validTaskIds = tasks.map(task => task.id);
        if (!validTaskIds.includes(Number(next.get('task_id')))) {
          next.set('task_id', `${tasks[0].id}`);
        }
      }
    }

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [seqId, tasks, isLoading, searchParams.get('tab')]);
}
