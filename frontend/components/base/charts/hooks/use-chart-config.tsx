import { useMemo } from 'react';

import { ChartAxisProps } from '../type';

export function usePieChartConfig(pies: string[]) {
  return useMemo(() => {
    const config: { [key: string]: {} } = {};
    pies.forEach(pie => {
      config[pie] = {};
    });

    return config;
  }, [pies]);
}

export function useBarChartConfig(axis: ChartAxisProps) {
  return useMemo(
    () => ({
      [axis.x.dataKey]: {},
      [axis.y.dataKey]: {},
    }),
    [axis.x, axis.y],
  );
}

export function useGroupedBarChartConfig(axis: ChartAxisProps, bars: string[]) {
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
