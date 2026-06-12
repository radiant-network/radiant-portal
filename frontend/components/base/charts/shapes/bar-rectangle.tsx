import { Bar, LabelList, Rectangle } from 'recharts';
import { BarRectangleProps } from '../type';

/**
 * Bar + Label.
 * Pattern is created with palettes/chart-palette and loaded through
 * the fill prop.
 *
 *      5
 *      ▓▒    3
 *      ▓▒    ▓▒
 *      ▓▒    ▓▒   1
 *      ▓▒    ▓▒   ▓▒
 *      ──    ──   ──
 */
function BarRectangle({ id, dataKey, layout, onClick }: BarRectangleProps) {
  return (
    <Bar
      dataKey={dataKey}
      onClick={onClick}
      shape={(props: any) => (
        <Rectangle
          {...props}
          fill={`url(#${id}-bar-pattern-${props.payload.patternIndex})`}
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
export default BarRectangle;
