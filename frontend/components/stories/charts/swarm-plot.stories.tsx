import type { Meta, StoryObj } from '@storybook/react-vite';

import SwarmPlot from '@/components/base/charts/swarm-plot/swarm-plot';
import { SwarmPlotPoint } from '@/components/base/charts/type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';

import { StorySection } from '../story-section';

import { swarmPlotGroups } from './data';

type SwarmSample = { sample_id: string; sex: string };

const geneExpressionProps = {
  groups: swarmPlotGroups,
  title: 'Gene expression — GENE1',
  yAxisLabel: 'FPKM',
  tooltip: (point: SwarmPlotPoint<SwarmSample>) => `${point.sample_id}: ${point.value.toFixed(2)} FPKM`,
  onPointClick: (point: SwarmPlotPoint<SwarmSample>) => {
    console.warn('point clicked', point);
  },
  onSelect: (points: SwarmPlotPoint<SwarmSample>[]) => {
    console.warn('points selected', points);
  },
};

const meta = {
  title: 'Components/Charts/Swarm Plot',
  component: SwarmPlot,
  args: geneExpressionProps,
} satisfies Meta<typeof SwarmPlot<SwarmSample>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Swarm plot">
      <div className="w-full flex gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Gene expression by group</CardTitle>
          </CardHeader>
          <CardContent className="h-[420px]">
            <SwarmPlot {...geneExpressionProps} />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>With selected samples (annotations)</CardTitle>
          </CardHeader>
          <CardContent className="h-[420px]">
            <SwarmPlot
              {...geneExpressionProps}
              selectedPoints={[
                swarmPlotGroups[0].points[8],
                swarmPlotGroups[0].points[5],
                swarmPlotGroups[0].points[3],
              ]}
              annotation={point => `${point.sample_id}: ${point.value.toFixed(2)} FPKM`}
            />
          </CardContent>
        </Card>
      </div>
    </StorySection>
  ),
};
