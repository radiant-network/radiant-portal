import { useEffect, useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { Annotations, Data, Layout, PlotMouseEvent, PlotSelectionEvent } from 'plotly.js';

import { usePlotlyTheme } from '@/components/base/charts/hooks/use-plotly-theme';
import { ScatterPlotPoint, ScatterPlotProps } from '@/components/base/charts/type';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { cn } from '@/components/lib/utils';

// Tailwind palette: slate-400 / red-700 / blue-400
const DEFAULT_COLORS = ['#94a3b8', '#b91c1c', '#60a5fa'];

const DIMMED_OPACITY = 0.4;

/**
 * Scatter plot: one WebGL marker series per group, scattered across the x/y plane.
 * Supports per-point coloring, dimming of non-highlighted points, point selection,
 * and annotation callouts. When exactly one point is annotated, the plot keeps it
 * centered while the user zooms.
 *
 *
 *        │ ·                  ·
 *        │  ··              ··
 *        │   ···          ···
 *        │     ···      ···
 *        │   ·· ············ ··
 *        └──────────────────────
 *              x-axis
 */
function ScatterPlot<T extends Record<string, unknown>>({
  series,
  title,
  xAxisLabel,
  yAxisLabel,
  loading = false,
  colors = DEFAULT_COLORS,
  pointColor,
  highlightedPoints,
  selectedPoints = [],
  tooltip,
  annotation,
  onPointClick,
  onSelect,
  className,
}: ScatterPlotProps<T>) {
  const theme = usePlotlyTheme();

  const data = useMemo<Data[]>(() => {
    const traces = series.map((serie, index) => {
      const seriesColor = serie.color ?? colors[index % colors.length];
      const dim = highlightedPoints !== undefined && highlightedPoints.length > 0;
      return {
        type: 'scattergl',
        mode: 'markers',
        name: serie.name,
        x: serie.points.map(point => point.x),
        y: serie.points.map(point => point.y),
        marker: {
          color: pointColor ? serie.points.map(pointColor) : seriesColor,
          opacity: dim ? serie.points.map(point => (highlightedPoints.includes(point) ? 1 : DIMMED_OPACITY)) : 1,
          size: 7,
          line: { color: 'white', width: 0.8 },
        },
        selected: { marker: { color: theme.foreground } },
        unselected: { marker: { opacity: DIMMED_OPACITY } },
        hoverlabel: { namelength: 0 },
        hovertemplate: tooltip ? '%{hovertext}<extra></extra>' : undefined,
        hovertext: tooltip ? serie.points.map(tooltip) : undefined,
        customdata: serie.points,
      };
    }) as unknown as Data[];

    return traces;
  }, [series, colors, pointColor, highlightedPoints, tooltip, theme]);

  const annotationKey = annotation ? selectedPoints.map(point => `${point.x},${point.y}`).join('|') : '';

  const baseLayout = useMemo<Partial<Layout>>(
    () => ({
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: theme.foreground },
      title: title ? { text: title, x: 0.05, font: { size: 16, weight: 600 } } : undefined,
      margin: { l: 40, r: 10, t: title ? 60 : 20, b: 40 },
      legend: {
        borderwidth: 1,
        bordercolor: theme.border,
        bgcolor: theme.card,
        yanchor: 'top',
        y: 0.99,
        xanchor: 'right',
        x: 0.99,
      },
      xaxis: {
        title: xAxisLabel ? { text: xAxisLabel, font: { size: 14 } } : undefined,
        tickfont: { size: 12 },
        gridcolor: theme.border,
        linecolor: theme.border,
        zerolinecolor: theme.border,
      },
      yaxis: {
        title: yAxisLabel ? { text: yAxisLabel, font: { size: 14 } } : undefined,
        tickfont: { size: 12 },
        automargin: true,
        gridcolor: theme.border,
        linecolor: theme.border,
        zerolinecolor: theme.border,
      },
    }),
    [title, xAxisLabel, yAxisLabel, theme],
  );

  const [layout, setLayout] = useState<Partial<Layout>>(baseLayout);
  const [plotKey, setPlotKey] = useState(0);
  const [isSelectionZoom, setIsSelectionZoom] = useState(false);

  // Reset the view (dropping any manual zoom) and remount whenever the
  // annotated points or axes change, so the annotated point is re-centered.
  useEffect(() => {
    const annotations: Partial<Annotations>[] = annotation
      ? series.flatMap(serie =>
          serie.points
            .filter(point => selectedPoints.includes(point))
            .map(point => ({
              x: point.x,
              y: point.y,
              text: annotation(point),
              arrowhead: 6,
              arrowsize: 1.6,
              arrowwidth: 2,
              arrowcolor: theme.foreground,
              ax: 30,
              ay: -50,
              bgcolor: theme.card,
              bordercolor: theme.border,
              borderwidth: 2,
              borderpad: 4,
              font: { size: 12, color: theme.foreground },
            })),
        )
      : [];
    setLayout({ ...baseLayout, annotations });
    setPlotKey(prevKey => prevKey + 1);
  }, [annotationKey, baseLayout]);

  if (loading) {
    return <Skeleton className={cn('h-full w-full', className)} />;
  }

  const handleClick = (event: Readonly<PlotMouseEvent>) => {
    const point = event.points[0]?.customdata as unknown as ScatterPlotPoint<T> | undefined;
    if (point) {
      onPointClick?.(point);
    }
  };

  const handleSelect = (event: Readonly<PlotSelectionEvent>) => {
    const points = (event?.points ?? []).map(p => p.customdata as unknown as ScatterPlotPoint<T>).filter(Boolean);
    onSelect?.(points);
  };

  const handleRelayout = (eventData: any) => {
    const isZoom = eventData['xaxis.range[0]'] !== undefined || eventData['yaxis.range[0]'] !== undefined;
    setLayout(prevLayout => {
      const currentAnnotations = (prevLayout.annotations as Partial<Annotations>[]) ?? [];
      if (!isSelectionZoom && isZoom && currentAnnotations.length > 0) {
        const first = currentAnnotations[0];
        const spanX = (eventData['xaxis.range[1]'] - eventData['xaxis.range[0]']) / 2;
        const spanY = (eventData['yaxis.range[1]'] - eventData['yaxis.range[0]']) / 2;
        return {
          ...prevLayout,
          xaxis: { ...prevLayout.xaxis, range: [(first.x as number) - spanX, (first.x as number) + spanX] },
          yaxis: { ...prevLayout.yaxis, range: [(first.y as number) - spanY, (first.y as number) + spanY] },
          annotations: currentAnnotations,
        };
      }
      return { ...prevLayout, annotations: currentAnnotations };
    });
    setIsSelectionZoom(false);
  };

  const handleRelayouting = () => setIsSelectionZoom(true);

  return (
    <Plot
      key={plotKey}
      className={cn('h-full w-full', className)}
      data={data}
      layout={layout}
      useResizeHandler
      config={{
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage', 'resetGeo', 'sendDataToCloud', 'pan2d'],
      }}
      onClick={onPointClick ? handleClick : undefined}
      onSelected={onSelect ? handleSelect : undefined}
      onRelayout={handleRelayout}
      onRelayouting={handleRelayouting}
    />
  );
}

export default ScatterPlot;
