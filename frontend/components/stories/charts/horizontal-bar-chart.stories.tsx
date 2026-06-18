import type { Meta, StoryObj } from '@storybook/react-vite';

import HorizontalBarChart from '@/components/base/charts/bar-charts/horizontal-bar-chart';
import ChartPalettePreview from '@/components/base/charts/palettes/chart-palette-preview';
import { ChartTooltipPayload } from '@/components/base/charts/type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';

import { StorySection } from '../story-section';

import { biospecimensData, filesByDataTypesData, hpoData, mondoData } from './data';

const hpoProps = {
  axis: {
    x: {
      dataKey: 'count',
      label: '# of participants',
    },
    y: {
      dataKey: 'hpo_id',
      width: 210,
      tickFormatter: (value: string) => value.replace(/\(HP:\d+\)/g, ''),
      label: 'Diagnosis (HPO)',
    },
  },
  data: hpoData,
  onClick: (data: any) => {
    console.warn('data', data);
  },
  tooltip: (payload: ChartTooltipPayload) => (
    <div className="flex gap-2">
      <div className="m-1">
        <ChartPalettePreview patternIndex={payload.patternIndex} />
      </div>
      <div className="flex-1">
        {payload.hpo_id}
        <div>Participants with this exact term: {payload.count}</div>
        <div>Participants including descendant term: {payload.countWithDescendant}</div>
      </div>
    </div>
  ),
};
const mondoProps = {
  axis: {
    x: {
      dataKey: 'count',
      label: '# of participants',
    },
    y: {
      dataKey: 'mondo_id',
      width: 180,
      tickFormatter: (value: string) => value.replace(/\(MONDO:\d+\)/g, ''),
      label: 'Diagnosis (MONDO)',
    },
  },
  data: mondoData,
  onClick: (data: any) => {
    console.warn('data', data);
  },
  tooltip: (payload: ChartTooltipPayload) => (
    <div className="flex gap-2">
      <div className="m-1">
        <ChartPalettePreview patternIndex={payload.patternIndex} />
      </div>
      <div className="flex-1">
        {payload.mondo_id}
        <div>Participants with this exact term: {payload.count}</div>
        <div>Participants including descendant term: {payload.countWithDescendant}</div>
      </div>
    </div>
  ),
};

const filesByDataTypesProps = {
  axis: {
    x: {
      dataKey: 'count',
      label: '# of files',
    },
    y: {
      dataKey: 'key',
      width: 180,
      label: 'Data Types',
    },
  },
  data: filesByDataTypesData.slice(0, 10),
  tooltip: (payload: ChartTooltipPayload) => (
    <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      {payload.key} <span className="font-bold">{payload.count}</span>
    </div>
  ),
};

const biospecimensProps = {
  axis: {
    x: {
      dataKey: 'count',
      label: '# of biospecimens',
    },
    y: {
      dataKey: 'key',
      width: 140,
      label: 'Sample Types',
    },
  },
  data: biospecimensData.slice(0, 10),
  tooltip: (payload: ChartTooltipPayload) => (
    <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      {payload.key} <span className="font-bold">{payload.count}</span>
    </div>
  ),
};

const meta = {
  title: 'Components/Charts/Horizontal Bar Chart',
  component: HorizontalBarChart,
  args: hpoProps,
} satisfies Meta<typeof HorizontalBarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Horizontal Bar chart">
      <div className="w-full flex gap-6">
        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>HPO (Clickable)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...hpoProps} />
          </CardContent>
        </Card>
        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>Mondo (Clickable)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...mondoProps} />
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6">
        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>HPO (colorblindMode off) (clickable)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...hpoProps} colorblindMode={false} />
          </CardContent>
        </Card>
        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>Mondo (colorblindMode off) (clickable)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...mondoProps} colorblindMode={false} />
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6">
        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>Files By Data Types</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...filesByDataTypesProps} />
          </CardContent>
        </Card>
        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>Biospecimens</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...biospecimensProps} />
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6">
        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>Files By Data Types (colorblindMode off)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...filesByDataTypesProps} colorblindMode={false} />
          </CardContent>
        </Card>
        <Card className={`w-full`}>
          <CardHeader>
            <CardTitle>Biospecimens (colorblindMode off)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...biospecimensProps} colorblindMode={false} />
          </CardContent>
        </Card>
      </div>
    </StorySection>
  ),
};
