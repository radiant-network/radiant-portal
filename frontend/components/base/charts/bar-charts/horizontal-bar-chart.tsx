import { useId } from 'react';
import { BarChart as RechartBarChart, CartesianGrid } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../shadcn/chart';
import ChartPalette from '../palettes/chart-palette';
import { useBarChartConfig } from '../hooks/use-chart-config';
import { useChartPalette } from '../hooks/use-chart-palette';
import { BarChartProps } from '../type';

import ChartAxis from '../axis/chart-axis';
import BarRectangle from '../shapes/bar-rectangle';

/**
 * Horizontal bar chart with a single series, one bar per category.
 *
 *     │  ▓▒
 *     │  ▓▒
 *     │  ▓▒          ▓▒
 *     │  ▓▒    ▓▒    ▓▒
 *     │  ▓▒ ▓▒ ▓▒ ▓▒ ▓▒ ▓▒
 *     └─────────────────────
 *        Lbl   Lbl2  Lbl3
 *
 */
function HorizontalBarChart<T extends object>({ axis, colorblindMode = true, data, tooltip }: BarChartProps<T>) {
  const id = useId();
  const chartData = useChartPalette(data);
  const chartConfig = useBarChartConfig(axis);

  return (
    <ChartContainer config={chartConfig}>
      <RechartBarChart accessibilityLayer data={chartData} layout="horizontal" margin={{ bottom: 12, left: 6 }}>
        <ChartPalette id={id} data={chartData} colorblindMode={colorblindMode} />

        <CartesianGrid />

        <ChartAxis axis={axis} layout="horizontal" />

        <BarRectangle dataKey="count" id={id} layout="horizontal" />

        <ChartTooltip
          isAnimationActive={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(_value, _name, _item, _index, payload: any) => tooltip(payload)}
            />
          }
        />
      </RechartBarChart>
    </ChartContainer>
  );
}
export default HorizontalBarChart;
