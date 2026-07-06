import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Annotations, Data, Layout, PlotMouseEvent, PlotSelectionEvent } from 'plotly.js';

import { SwarmPlotPoint, SwarmPlotProps } from '@/components/base/charts/type';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { cn } from '@/components/lib/utils';

// Tailwind palette: sky-600 / slate-400
const DEFAULT_COLORS = ['#0284c7', '#94a3b8'];

/**
 * Swarm plot: one jittered column of points per group, distributed along the
 * y-axis by their value.
 *
 *        │   · ·           ·
 *        │  · · ··        · ·
 *        │ · ···· ·      · · ·
 *        │  · · ·         · ··
 *        └──────────────────────
 *          Group A        Group B
 */
function SwarmPlot<T extends Record<string, unknown>>({
  groups,
  title,
  yAxisLabel,
  loading = false,
  colors = DEFAULT_COLORS,
  selectedPoints = [],
  tooltip,
  annotation,
  onPointClick,
  onSelect,
  className,
}: SwarmPlotProps<T>) {
  const data = useMemo<Data[]>(
    () =>
      groups.map((group, index) => {
        const color = group.color ?? colors[index % colors.length];
        return {
          type: 'box',
          name: group.name,
          x: Array(group.points.length).fill(index + 1),
          y: group.points.map(point => point.value),
          boxpoints: 'all',
          jitter: 1,
          pointpos: 0,
          marker: { color, size: 7, line: { color: 'white', width: 0.5 } },
          selected: { marker: { color } },
          unselected: { marker: { color, opacity: 0.1 } },
          hoverlabel: { namelength: 0 },
          hovertemplate: tooltip ? '%{hovertext}<extra></extra>' : undefined,
          hovertext: tooltip ? group.points.map(tooltip) : undefined,
          customdata: group.points,
        };
      }) as unknown as Data[],
    [groups, colors, tooltip],
  );

  const annotations: Partial<Annotations>[] = annotation
    ? groups.flatMap((group, index) =>
        group.points
          .filter(point => selectedPoints.includes(point))
          .map(point => ({
            x: index + 1,
            y: point.value,
            text: annotation(point),
            arrowhead: 6,
            ax: 100,
            ay: 0,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            bordercolor: 'black',
            borderwidth: 1,
            font: { size: 12 },
          })),
      )
    : [];

  if (loading) {
    return <Skeleton className={cn('h-full w-full', className)} />;
  }

  const handleClick = (event: Readonly<PlotMouseEvent>) => {
    const point = event.points[0]?.customdata as unknown as SwarmPlotPoint<T> | undefined;
    if (point) {
      onPointClick?.(point);
    }
  };

  const handleSelect = (event: Readonly<PlotSelectionEvent>) => {
    const points = (event?.points ?? []).map(p => p.customdata as unknown as SwarmPlotPoint<T>).filter(Boolean);
    onSelect?.(points);
  };

  const layout: Partial<Layout> = {
    annotations,
    autosize: true,
    title: title ? { text: title, x: 0.05, font: { size: 16, weight: 600 } } : undefined,
    margin: { l: 40, r: 10, t: title ? 60 : 20, b: 40 },
    legend: { borderwidth: 1, yanchor: 'top', y: 0.99, xanchor: 'right', x: 0.99 },
    yaxis: { title: yAxisLabel ? { text: yAxisLabel } : undefined },
    xaxis: { tickvals: groups.map((_, index) => index + 1), ticktext: groups.map(group => group.name) },
  };

  return (
    <Plot
      className={cn('h-full w-full', className)}
      data={data}
      layout={layout}
      useResizeHandler
      config={{
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage', 'resetGeo', 'lasso2d', 'sendDataToCloud', 'zoomIn2d', 'zoomOut2d', 'pan2d'],
      }}
      onClick={onPointClick ? handleClick : undefined}
      onSelecting={onSelect ? handleSelect : undefined}
    />
  );
}

export default SwarmPlot;
