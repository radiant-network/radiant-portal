import HorizontalBarChart from '@/components/base/charts/bar-charts/horizontal-bar-chart';

import { type ChartBlock as ChartBlockData } from '../types';

/**
 * Renders a chart block as a single-series horizontal bar chart.
 *
 * POC scope: only the horizontal bar chart is supported. To add more chart
 * types later:
 *   1. add a discriminant to ChartBlock in types.ts, e.g. `chart: 'bar' | 'pie'`;
 *   2. switch on `block.chart` here and render the matching component — the repo
 *      already ships others under components/base/charts/ (e.g. pie-charts/pie-chart,
 *      bar-charts/vertical-bar-chart). Mind their prop contracts (PieChart needs
 *      `pies` + `tooltip`; see components/base/charts/type.ts).
 */
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
