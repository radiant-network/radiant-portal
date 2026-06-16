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
  bars?: string[];
  data: ReadonlyArray<T>;
  colorblindMode?: boolean;
  onClick?: (data: any) => void;
  tooltip: (payload: ChartTooltipPayload) => ReactNode;
};

export type GroupedBarChartProps<T extends object> = BarChartProps<T> & {
  bars: string[];
};
