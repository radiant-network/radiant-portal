import type { Meta, StoryObj } from '@storybook/react-vite';

import GroupedVerticalBarChart from '@/components/base/charts/bar-charts/grouped-vertical-bar-chart';
import VerticalBarChart from '@/components/base/charts/bar-charts/vertical-bar-chart';
import ChartPalettePreview from '@/components/base/charts/palettes/chart-palette-preview';
import { ChartTooltipPayload } from '@/components/base/charts/type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';

import { StorySection } from '../story-section';

import { ageAtFirstEngagementIncludeData, ageAtFirstEngagementKFData } from './data';

const ageAtFirstEngagementFKProps = {
  axis: {
    x: {
      dataKey: 'age',
      label: 'Age at First Patient Engagement (years)',
    },
    y: {
      dataKey: 'count',
      label: '# of participants',
    },
  },
  data: ageAtFirstEngagementKFData,
  onClick: (data: any) => {
    console.warn('data', data);
  },
  tooltip: (payload: ChartTooltipPayload) => (
    <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      Participants {payload.count}
    </div>
  ),
};

const ageAtFirstEngagementIncludeProps = {
  axis: {
    x: {
      dataKey: 'age',
      label: 'Age at First Patient Engagement (years)',
    },
    y: {
      dataKey: 'trisomy',
      label: '# of participants',
    },
  },
  bars: ['trisomy', 'disomy'],
  data: ageAtFirstEngagementIncludeData,
  onClick: (data: any) => {
    console.warn('data', data);
  },
  tooltip: (payload: ChartTooltipPayload) => (
    <div>
      <div className="flex gap-2 items-center">
        <ChartPalettePreview patternIndex={0} />
        Participants: {payload.trisomy}
      </div>
      <div className="flex gap-2 items-center">
        <ChartPalettePreview patternIndex={1} />
        Participants: {payload.disomy}
      </div>
    </div>
  ),
};

const meta = {
  title: 'Components/Charts/Vertical Bar Chart',
  component: VerticalBarChart,
  args: ageAtFirstEngagementFKProps,
} satisfies Meta<typeof VerticalBarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Vertical Bar chart">
      <div className="w-full flex gap-6">
        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>Age At First Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <VerticalBarChart {...ageAtFirstEngagementFKProps} />
          </CardContent>
        </Card>

        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>Age At First Engagement (Grouped)</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedVerticalBarChart {...ageAtFirstEngagementIncludeProps} />
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6">
        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>Age At First Engagement (colorblindMode off)</CardTitle>
          </CardHeader>
          <CardContent>
            <VerticalBarChart {...ageAtFirstEngagementFKProps} colorblindMode={false} />
          </CardContent>
        </Card>

        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>Age At First Engagement (colorblindMode off) (grouped)</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedVerticalBarChart {...ageAtFirstEngagementIncludeProps} colorblindMode={false} />
          </CardContent>
        </Card>
      </div>
    </StorySection>
  ),
};
