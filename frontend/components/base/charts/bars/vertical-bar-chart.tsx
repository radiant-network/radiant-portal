import { BarChart as RechartBarChart, CartesianGrid } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../shadcn/chart';

import { useChartPalette } from '../hooks/use-chart-palette';
import ChartPalette from '../palettes/chart-palette';
import { BarChartProps } from '../type';
import { useId } from 'react';
import { useBarChartConfig } from '../hooks/use-chart-config';
import ChartAxisProps from '../axis/chart-axis';
import BarRectangle from '../shapes/bar-rectangle';

function VerticalBarChart<T extends object>({ axis, data, colorblindMode = true, tooltip }: BarChartProps<T>) {
  const id = useId();
  const chartData = useChartPalette(data);
  const chartConfig = useBarChartConfig(axis);

  return (
    <ChartContainer config={chartConfig}>
      <RechartBarChart accessibilityLayer data={chartData} layout="vertical" margin={{ bottom: 12, left: 6 }}>
        <ChartPalette id={id} data={chartData} colorblindMode={colorblindMode} />

        <CartesianGrid />

        <ChartAxisProps axis={axis} layout="vertical" />

        <BarRectangle dataKey="count" id={id} layout="vertical" />

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
