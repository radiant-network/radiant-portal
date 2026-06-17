import { useId } from 'react';
import { PieChart as RechartPieChart } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../shadcn/chart';
import { usePieChartConfig } from '../hooks/use-chart-config';
import { useChartPalette } from '../hooks/use-chart-palette';
import ChartPalette from '../palettes/chart-palette';
import ChartPalettePreview from '../palettes/chart-palette-preview';
import PieSlice from '../shapes/pie-slice';
import { PieChartProps } from '../type';

/**
 * Pie chart
 *
 * {dataKey, nameKey} use default key "count" and "label" .
 *
 *           ___
 *         ╱▒░│▓▓╲
 *        │░░ │ ▓▓│
 *        │▒▒ └──┤│
 *         ╲▒▒▒▒▒╱
 *           ‾‾‾
 *    ▓ legend1 ░ legend2
 *          title
 */
function PieChart<T extends object>({
  data,
  pies,
  colorblindMode = true,
  dataKey = 'count',
  nameKey = 'label',
  title,
  legend = false,
  onClick,
  tooltip,
}: PieChartProps<T>) {
  const id = useId();
  const chartData = useChartPalette(data);
  const chartConfig = usePieChartConfig(pies);
  return (
    <div className="flex flex-col items-center h-full">
      <ChartContainer config={chartConfig} className="aspect-square flex-1 min-h-0 w-full max-w-full">
        <RechartPieChart>
          <ChartPalette id={id} data={chartData} colorblindMode={colorblindMode} />
          <ChartTooltip
            cursor={false}
            isAnimationActive={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(_value, _name, _item, _index, payload: any) => tooltip(payload)}
              />
            }
          />
          <PieSlice id={id} data={chartData} dataKey={dataKey} nameKey={nameKey} onClick={onClick} outerRadius="90%" />
        </RechartPieChart>
      </ChartContainer>
      {legend && (
        <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-xs">
          {chartData.map((entry, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <ChartPalettePreview patternIndex={entry.patternIndex} />
              <span>{String((entry as Record<string, unknown>)[nameKey])}</span>
            </li>
          ))}
        </ul>
      )}
      {title && <p className="text-sm text-muted-foreground mt-2 text-center">{title}</p>}
    </div>
  );
}
export default PieChart;
