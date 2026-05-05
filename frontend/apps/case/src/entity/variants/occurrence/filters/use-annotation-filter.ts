import { useMemo, useState } from 'react';

import type { GermlineSNVOccurrence } from '@/api/api';

import type { FlagType } from '../hooks/use-variant-flags';
import { flagStore, useFlagsVersion } from '../hooks/use-variant-flags';

type AnnotationFilter = {
  hasInterpretation: boolean;
  hasNote: boolean;
  flags: Set<FlagType>;
};

const EMPTY_ANNOTATION_FILTER: AnnotationFilter = {
  hasInterpretation: false,
  hasNote: false,
  flags: new Set(),
};

export function useAnnotationFilter() {
  const [filter, setFilter] = useState<AnnotationFilter>(EMPTY_ANNOTATION_FILTER);
  useFlagsVersion();

  const activeCount = (filter.hasInterpretation ? 1 : 0) + (filter.hasNote ? 1 : 0) + filter.flags.size;
  const isActive = activeCount > 0;

  const applyFilter = useMemo(
    () => (rows: GermlineSNVOccurrence[]) => {
      if (!isActive) return rows;
      return rows.filter(row => {
        if (filter.hasInterpretation && row.has_interpretation) return true;
        if (filter.hasNote && row.has_note) return true;
        if (filter.flags.size > 0) {
          const flag = flagStore.get(row.locus_id);
          if (flag && filter.flags.has(flag)) return true;
        }
        return false;
      });
    },
    [filter, isActive],
  );

  const setHasInterpretation = (value: boolean) => setFilter(f => ({ ...f, hasInterpretation: value }));
  const setHasNote = (value: boolean) => setFilter(f => ({ ...f, hasNote: value }));
  const toggleFlag = (type: FlagType) =>
    setFilter(f => {
      const next = new Set(f.flags);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return { ...f, flags: next };
    });
  const clear = () => setFilter(EMPTY_ANNOTATION_FILTER);

  return {
    filter,
    isActive,
    activeCount,
    applyFilter,
    setHasInterpretation,
    setHasNote,
    toggleFlag,
    clear,
  };
}

export type AnnotationFilterController = ReturnType<typeof useAnnotationFilter>;
