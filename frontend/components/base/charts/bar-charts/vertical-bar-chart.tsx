import { useId } from 'react';
import { BarChart as RechartBarChart, CartesianGrid } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../shadcn/chart';
import ChartAxis from '../axis/chart-axis';
import { useBarChartConfig } from '../hooks/use-chart-config';
import { useChartPalette } from '../hooks/use-chart-palette';
import ChartPalette from '../palettes/chart-palette';
import BarRectangle from '../shapes/bar-rectangle';
import { BarChartProps } from '../type';

/**
 * Vertical bar chart with a single series, one bar per category.
 *
 * Value (number) must always use "count" key
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
function VerticalBarChart<T extends object>({ axis, colorblindMode = true, data, onClick, tooltip }: BarChartProps<T>) {
  const id = useId();
  const chartData = useChartPalette(data);
  const chartConfig = useBarChartConfig(axis);

  return (
    <ChartContainer config={chartConfig}>
      <RechartBarChart accessibilityLayer data={chartData} layout="horizontal" margin={{ bottom: 12, left: 6 }}>
        <ChartPalette id={id} data={chartData} colorblindMode={colorblindMode} />

        <CartesianGrid />

        <ChartAxis axis={axis} layout="horizontal" />

        <BarRectangle dataKey="count" id={id} layout="horizontal" onClick={onClick} />

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
export default VerticalBarChart;
