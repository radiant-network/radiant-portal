import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';

import { StorySection } from '../story-section';
import { ageAtFirstEngamentIncludeData, ageAtFirstEngamentKFData } from './data';
import HorizontalBarChart from '@/components/base/charts/bar-charts/horizontal-bar-chart';
import GroupedHorizontalBarChart from '@/components/base/charts/bar-charts/grouped-horizontal-bar-chart';
import { ChartTooltipPayload } from '@/components/base/charts/type';
import ChartPalettePreview from '@/components/base/charts/palettes/chart-palette-preview';

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
  data: ageAtFirstEngamentKFData,
  tooltip: (payload: ChartTooltipPayload) => {
    return (
      <div className="flex gap-2 items-center">
        <ChartPalettePreview patternIndex={payload.patternIndex} />
        Participants {payload.count}
      </div>
    );
  },
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
  data: ageAtFirstEngamentIncludeData,
  tooltip: (payload: ChartTooltipPayload) => {
    return (
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
    );
  },
};

const meta = {
  title: 'Components/Charts/Horizontal Bar Chart',
  component: HorizontalBarChart,
  args: ageAtFirstEngagementFKProps,
} satisfies Meta<typeof HorizontalBarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <StorySection title="Horizontal Bar chart">
        <div className="w-full flex gap-6">
          <Card className={`w-full`}>
            <CardHeader>
              <CardTitle>Age At First Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <HorizontalBarChart {...ageAtFirstEngagementFKProps} />
            </CardContent>
          </Card>

          <Card className={`w-full`}>
            <CardHeader>
              <CardTitle>Age At First Engagement (Grouped)</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupedHorizontalBarChart {...ageAtFirstEngagementIncludeProps} />
            </CardContent>
          </Card>
        </div>

        <div className="w-full flex gap-6">
          <Card className={`w-full`}>
            <CardHeader>
              <CardTitle>Age At First Engagement (colorblindMode off)</CardTitle>
            </CardHeader>
            <CardContent>
              <HorizontalBarChart {...ageAtFirstEngagementFKProps} colorblindMode={false} />
            </CardContent>
          </Card>

          <Card className={`w-full`}>
            <CardHeader>
              <CardTitle>Age At First Engagement (colorblindMode off) (grouped)</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupedHorizontalBarChart {...ageAtFirstEngagementIncludeProps} colorblindMode={false} />
            </CardContent>
          </Card>
        </div>
      </StorySection>
    );
  },
};
