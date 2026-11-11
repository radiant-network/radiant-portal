import { useMemo } from 'react';

export const colors = ['red', 'orange', 'amber', 'yellow', 'green', 'cyan', 'blue', 'violet', 'fuchsia'];

export function useChartPalette<T extends object>(data: ReadonlyArray<T>): ReadonlyArray<T & { patternIndex: number }> {
  return useMemo(() => data.map((e, i) => ({ ...e, patternIndex: i % colors.length })), [data]);
}
