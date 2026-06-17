import { useId } from 'react';
import { BarChart as RechartBarChart, CartesianGrid } from 'recharts';

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from '../../shadcn/chart';
import ChartAxis from '../axis/chart-axis';
import { useGroupedBarChartConfig } from '../hooks/use-chart-config';
import { colors, useChartPalette } from '../hooks/use-chart-palette';
import ChartPalette from '../palettes/chart-palette';
import GroupedBarRectangle from '../shapes/grouped-bar-rectangle';
import { ChartTooltipPayload, GroupedBarChartProps } from '../type';

/**
 * Horizontal bar chart with grouped (side-by-side) series per category.
 *
 * "bars" is used to generate the dataKey
 *
 *     ■ test 1  ■ test 2
 *     │  ▓▒
 *     │  ▓▒
 *     │  ▓▒          ▓▒
 *     │  ▓▒    ▓▒    ▓▒
 *     │  ▓▒ ▓▒ ▓▒ ▓▒ ▓▒ ▓▒
 *     └─────────────────────
 *        Lbl   Lbl2  Lbl3
 *
 *
 * ChartTooltipContent is not used since we need the complete context to
 * render the custom tooltip.
 *
 */
function GroupedHorizontalBarChart<T extends object>({
  axis,
  bars,
  colorblindMode = true,
  tooltip,
  data,
}: GroupedBarChartProps<T>) {
  const id = useId();
  const chartData = useChartPalette(data);
  const chartConfig = useGroupedBarChartConfig(axis, bars);

  return (
    <ChartContainer config={chartConfig}>
      <RechartBarChart accessibilityLayer data={chartData} layout="horizontal" margin={{ bottom: 12, left: 6 }}>
        <ChartPalette id={id} data={chartData} colorblindMode={colorblindMode} />

        <CartesianGrid />

        <ChartAxis axis={axis} layout="horizontal" />

        {bars.map((bar, i) => (
          <GroupedBarRectangle
            key={bar}
            dataKey={bar}
            id={id}
            layout="horizontal"
            patternIndex={i}
            color={`var(--color-${colors[i % colors.length]}-400)`}
          />
        ))}

        <ChartTooltip
          isAnimationActive={false}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                {tooltip(payload[0].payload as ChartTooltipPayload)}
              </div>
            );
          }}
        />
        <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
      </RechartBarChart>
    </ChartContainer>
  );
}
export default GroupedHorizontalBarChart;
