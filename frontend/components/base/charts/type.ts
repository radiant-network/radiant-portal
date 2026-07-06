import { ReactNode } from 'react';

export type ChartLayout = 'horizontal' | 'vertical';

export type Axis = {
  dataKey: string;
  tickFormatter?: (value: string) => string;
  label: string;
  width?: number;
};

export type ChartAxisProps = {
  x: Axis;
  y: Axis;
};

export type BarRectangleProps = {
  id: string;
  dataKey: string;
  layout: ChartLayout;
  onClick?: (data: any) => void;
};

export type PieSliceProps = {
  id: string;
  data: ReadonlyArray<object>;
  dataKey: string;
  nameKey: string;
  outerRadius?: number | string;
  onClick?: (data: any) => void;
};

export type GroupedBarRectangleProps = BarRectangleProps & {
  patternIndex: number;
  color: string;
};

export type ChartTooltipPayload = {
  count: number;
  patternIndex: number;
  [key: string]: string | number;
};

export type BarChartProps<T extends object> = {
  axis: ChartAxisProps;
  data: ReadonlyArray<T>;
  colorblindMode?: boolean;
  onClick?: (data: any) => void;
  tooltip: (payload: ChartTooltipPayload) => ReactNode;
};

export type GroupedBarChartProps<T extends object> = BarChartProps<T> & {
  bars: string[];
};

export type PieChartProps<T extends object> = {
  data: ReadonlyArray<T>;
  pies: string[];
  dataKey?: string;
  nameKey?: string;
  title?: string;
  legend?: boolean;
  colorblindMode?: boolean;
  onClick?: (data: any) => void;
  tooltip: (payload: ChartTooltipPayload) => ReactNode;
};

type UpsetItem = {
  name: string;
  elems: string[];
};

export type UpsetChartProps = {
  data: UpsetItem[];
  setName: string;
  combinationName: string;
  attributesSanitizer?: RegExp;
  onClick?: (data: string[]) => void;
};

export type SwarmPlotPoint<T = Record<string, unknown>> = T & {
  /** Numeric value distributed along the y-axis. */
  value: number;
};

export type SwarmPlotGroup<T = Record<string, unknown>> = {
  /** Label used for the x-axis tick and the legend entry. */
  name: string;
  color?: string;
  points: SwarmPlotPoint<T>[];
};

export type SwarmPlotProps<T = Record<string, unknown>> = {
  groups: SwarmPlotGroup<T>[];
  title?: string;
  yAxisLabel?: string;
  loading?: boolean;
  colors?: string[];
  selectedPoints?: SwarmPlotPoint<T>[];
  tooltip?: (point: SwarmPlotPoint<T>) => string;
  annotation?: (point: SwarmPlotPoint<T>) => string;
  onPointClick?: (point: SwarmPlotPoint<T>) => void;
  onSelect?: (points: SwarmPlotPoint<T>[]) => void;
  className?: string;
};

export type ScatterPlotPoint<T = Record<string, unknown>> = T & {
  x: number;
  y: number;
};

export type ScatterPlotSeries<T = Record<string, unknown>> = {
  /** Legend label for this series. */
  name: string;
  /** Marker color (hex/rgb). Falls back to the palette when omitted. */
  color?: string;
  points: ScatterPlotPoint<T>[];
};

export type ScatterPlotProps<T = Record<string, unknown>> = {
  series: ScatterPlotSeries<T>[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  loading?: boolean;
  /** Fallback colors for series without an explicit color. */
  colors?: string[];
  /** Per-point color override (e.g. gray-out below a significance threshold). Takes precedence over the series color. */
  pointColor?: (point: ScatterPlotPoint<T>) => string;
  /** When provided, these points stay at full opacity and all others are dimmed. */
  highlightedPoints?: ScatterPlotPoint<T>[];
  /** Points highlighted with an annotation callout. */
  selectedPoints?: ScatterPlotPoint<T>[];
  tooltip?: (point: ScatterPlotPoint<T>) => string;
  annotation?: (point: ScatterPlotPoint<T>) => string;
  onPointClick?: (point: ScatterPlotPoint<T>) => void;
  onSelect?: (points: ScatterPlotPoint<T>[]) => void;
  className?: string;
};
