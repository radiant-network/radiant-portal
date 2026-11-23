import { useMemo } from 'react';

import { useDebounce } from '@/components/hooks/useDebounce';

import type { Locus } from '../libs/genome';

// Debounced on a string: the caller builds a new locus object at every render.
export function useSettledLocus(locus: Locus | undefined, delay: number): Locus | undefined {
  const settledKey = useDebounce(locus && `${locus.chromosome}:${locus.start}:${locus.end}`, delay);
  return useMemo(() => {
    if (!settledKey) return undefined;
    const [chromosome, start, end] = settledKey.split(':');
    return { chromosome, start: Number(start), end: Number(end) };
  }, [settledKey]);
}
