import type { Meta, StoryObj } from '@storybook/react-vite';

import ChartPalettePreview from '@/components/base/charts/palettes/chart-palette-preview';
import PieChart from '@/components/base/charts/pie-charts/pie-chart';
import { ChartTooltipPayload } from '@/components/base/charts/type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';

import { StorySection } from '../story-section';

import { ethnicityData, familyTypeData, raceData, sexData, studiesData } from './data';

const studiesProps = {
  data: studiesData,
  pies: studiesData.map(d => d.label),
  onClick: (data: any) => {
    console.warn('data', data);
  },
  tooltip: (payload: ChartTooltipPayload) => (
    <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      {payload.label} <span className="font-bold">{payload.count}</span>
    </div>
  ),
};

const sexProps = {
  title: 'Sex',
  data: sexData,
  pies: sexData.map(d => d.label),
  tooltip: (payload: ChartTooltipPayload) => (
    <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      {payload.label} <span className="font-bold">{payload.count}</span>
    </div>
  ),
};

const raceProps = {
  title: 'Race',
  data: raceData,
  pies: raceData.map(d => d.label),
  tooltip: (payload: ChartTooltipPayload) => (
    <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      {payload.label} <span className="font-bold">{payload.count}</span>
    </div>
  ),
};

const ethnicityProps = {
  title: 'ethnicity',
  data: ethnicityData,
  pies: ethnicityData.map(d => d.label),
  tooltip: (payload: ChartTooltipPayload) => (
    <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      {payload.label} <span className="font-bold">{payload.count}</span>
    </div>
  ),
};

const familyTypeProps = {
  title: 'Family Composition',
  data: familyTypeData,
  pies: familyTypeData.map(d => d.label),
  tooltip: (payload: ChartTooltipPayload) => (
    <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      {payload.label} <span className="font-bold">{payload.count}</span>
    </div>
  ),
};

const meta = {
  title: 'Components/Charts/Pie Chart',
  component: PieChart,
  args: studiesProps,
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Pie chart">
      <div className="w-full flex gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Studies (clickable)</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64">
            <PieChart {...studiesProps} />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Studies (clickable) (colorblindMode off)</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64">
            <PieChart {...studiesProps} colorblindMode={false} />
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Studies (clickable)</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart {...studiesProps} legend />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Studies (clickable) (colorblindMode off)</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart {...studiesProps} colorblindMode={false} legend />
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            {[sexProps, ethnicityProps, raceProps, familyTypeProps].map((props, i) => (
              <div key={i} className="flex-1 min-w-0 h-full">
                <PieChart {...props} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Demographics (colorblindMode off)</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            {[sexProps, ethnicityProps, raceProps, familyTypeProps].map((props, i) => (
              <div key={i} className="flex-1 min-w-0 h-full">
                <PieChart {...props} colorblindMode={false} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </StorySection>
  ),
};
