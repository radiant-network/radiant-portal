import { Pie, Sector } from 'recharts';

import { PieSliceProps } from '../type';

/**
 * Slice of pie chart.
 *        ___
 *      ╱▒░│▓▓╲
 *     │░░ │ ▓▓│
 *     │▒▒ └──┤│
 *      ╲▒▒▒▒▒╱
 *        ‾‾‾
 */
function PieSlice({ id, data, dataKey, nameKey, outerRadius, onClick }: PieSliceProps) {
  return (
    <Pie
      data={data}
      dataKey={dataKey}
      nameKey={nameKey}
      outerRadius={outerRadius}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
      shape={(props: any) => <Sector {...props} fill={`url(#${id}-bar-pattern-${props.payload.patternIndex})`} />}
    />
  );
}
export default PieSlice;
