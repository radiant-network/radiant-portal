import HorizontalBarChart from '@/components/base/charts/bar-charts/horizontal-bar-chart';

import { type ChartBlock as ChartBlockData } from '../types';

/** Renders a chart block as a single-series horizontal bar chart. */
export function ChartBlock({ block }: { block: ChartBlockData }) {
  return (
    <div className="w-full rounded-md border p-3">
      {block.title && <p className="mb-2 text-xs font-medium text-muted-foreground">{block.title}</p>}
      <div className="h-48 w-full">
        <HorizontalBarChart
          data={block.data}
          axis={{
            x: { dataKey: 'count', label: block.valueLabel },
            y: { dataKey: 'label', label: block.categoryLabel, width: 128 },
          }}
          tooltip={payload => `${payload.label}: ${payload.count}`}
        />
      </div>
    </div>
  );
}
