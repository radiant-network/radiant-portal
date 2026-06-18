import { Bar, LabelList, Rectangle } from 'recharts';

import { GroupedBarRectangleProps } from '../type';

/**
 * Bar + Label
 *
 * Pattern is created with palettes/chart-palette and loaded through
 * the fill prop. Bars are grouped by series.
 * Each series uses the same color across every category.
 * color is set on the Bar so the legend swatch matches the pattern.
 *
 *      ▓▒
 *      ▓▒          ▒░
 *      ▓▒          ▒░
 *      ▓▒ ▒░       ▒░ ▓▒
 *      ▓▒ ▒░ ▓▒ ▒░ ▒░ ▓▒
 *      ──    ──    ──
 */
function GroupedBarRectangle({ id, dataKey, layout, patternIndex, color, onClick }: GroupedBarRectangleProps) {
  return (
    <Bar
      dataKey={dataKey}
      fill={color}
      onClick={onClick}
      shape={(props: any) => (
        <Rectangle
          {...props}
          fill={`url(#${id}-bar-pattern-${patternIndex})`}
          style={onClick ? { cursor: 'pointer' } : undefined}
        />
      )}
      radius={2}
    >
      {
        <LabelList
          dataKey={dataKey}
          className="fill-foreground"
          fontSize={12}
          position={layout == 'horizontal' ? 'top' : 'middle'}
          style={onClick ? { cursor: 'pointer' } : undefined}
        />
      }
    </Bar>
  );
}
export default GroupedBarRectangle;
