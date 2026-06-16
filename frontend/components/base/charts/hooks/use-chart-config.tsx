import { useMemo } from 'react';
import { ChartAxis } from '../type';

export function useBarChartConfig(axis: ChartAxis) {
  return useMemo(
    () => ({
      [axis.x.dataKey]: {},
      [axis.y.dataKey]: {},
    }),
    [axis.x, axis.y],
  );
}

export function useGroupedBarChartConfig(axis: ChartAxis, bars: string[]) {
  return useMemo(() => {
    const seriesConfig = bars.reduce<Record<string, { label: string }>>((acc, key) => {
      acc[key] = { label: key };
      return acc;
    }, {});
    return {
      [axis.x.dataKey]: {},
      [axis.y.dataKey]: {},
      ...seriesConfig,
    };
  }, [axis.x, axis.y, bars]);
}
