import { XAxis, YAxis } from 'recharts';
import { ChartAxisProps, ChartLayout } from '../type';

type AxisProps = {
  layout: ChartLayout;
  axis: ChartAxisProps;
};

/**
 * Renders the X and Y axes for a bar chart.
 * Y label is always rotated by -90 degrees.
 *
 *  y  │
 *  l  │
 *  a  │
 *  b  │
 *  e  │
 *  l  └─────────────
 *        x.label
 */
function ChartAxis({ axis, layout }: AxisProps) {
  return (
    <>
      <XAxis
        dataKey={axis.x.dataKey}
        type={layout == 'horizontal' ? 'category' : 'number'}
        tickMargin={4}
        tickFormatter={axis.x.tickFormatter}
        label={{
          value: axis.x.label,
          position: 'insideBottom',
          offset: -8,
          className: 'fill-muted-foreground text-xs',
          style: { textAnchor: 'middle' },
        }}
      />
      <YAxis
        dataKey={axis.y.dataKey}
        type={layout == 'horizontal' ? 'number' : 'category'}
        width={axis.y.width}
        tickMargin={4}
        tickFormatter={axis.y.tickFormatter}
        label={{
          value: axis.y.label,
          angle: -90,
          position: 'insideLeft',
          offset: 0,
          className: 'fill-muted-foreground text-xs',
          style: { textAnchor: 'middle' },
        }}
      />
    </>
  );
}
export default ChartAxis;
