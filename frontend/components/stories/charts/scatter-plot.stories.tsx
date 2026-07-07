import type { Meta, StoryObj } from '@storybook/react-vite';

import ScatterPlot from '@/components/base/charts/scatter-plot/scatter-plot';
import { ScatterPlotPoint } from '@/components/base/charts/type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';

import { StorySection } from '../story-section';

import { scatterPlotSeries } from './data';

type DiffGene = { gene_symbol: string; padj: number };

// Volcano coloring: gray below the significance threshold, otherwise red (up) / blue (down).
const NON_SIGNIFICANT = '#94a3b8';
const UP = '#b91c1c';
const DOWN = '#60a5fa';
const FDR_THRESHOLD = 0.05;

const volcanoProps = {
  series: scatterPlotSeries,
  title: 'Differential gene expression',
  xAxisLabel: 'log2 fold change',
  yAxisLabel: '-log10(q-value)',
  pointColor: (point: ScatterPlotPoint<DiffGene>) => {
    if (point.padj > FDR_THRESHOLD) {
      return NON_SIGNIFICANT;
    }
    return point.x > 0 ? UP : DOWN;
  },
  tooltip: (point: ScatterPlotPoint<DiffGene>) =>
    `${point.gene_symbol} — log2FC ${point.x.toFixed(2)}, q ${point.padj.toExponential(1)}`,
  onPointClick: (point: ScatterPlotPoint<DiffGene>) => {
    console.warn('gene clicked', point);
  },
  onSelect: (points: ScatterPlotPoint<DiffGene>[]) => {
    console.warn('genes selected', points);
  },
};

const meta = {
  title: 'Components/Charts/Scatter Plot',
  component: ScatterPlot,
  args: volcanoProps,
} satisfies Meta<typeof ScatterPlot<DiffGene>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Scatter plot">
      <div className="w-full flex gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Volcano plot</CardTitle>
          </CardHeader>
          <CardContent className="h-[420px]">
            <ScatterPlot {...volcanoProps} />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>With a selected gene (annotation)</CardTitle>
          </CardHeader>
          <CardContent className="h-[420px]">
            <ScatterPlot
              {...volcanoProps}
              selectedPoints={[scatterPlotSeries[0].points[2]]}
              annotation={point => point.gene_symbol}
            />
          </CardContent>
        </Card>
      </div>
    </StorySection>
  ),
};
