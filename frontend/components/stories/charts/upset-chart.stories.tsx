import type { Meta, StoryObj } from '@storybook/react';

import UpsetChart from '@/components/base/charts/upset-charts/upset-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';

import { StorySection } from '../story-section';

import { cooccurenceOftopTenConditionsData } from './data';

const meta = {
  title: 'Components/Charts/Upset Chart',
  component: UpsetChart,
  args: {
    data: cooccurenceOftopTenConditionsData,
    setName: '# of participants',
    combinationName: '# of participants',
    attributesSanitizer: /\s*\(HP:\d+\)/g,
    onClick: (data: string[]) => {
      console.warn(data);
    },
  },
} satisfies Meta<typeof UpsetChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <StorySection title="Upset chart">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Co-occurrence of Top 10 Conditions (Clickable)</CardTitle>
        </CardHeader>
        <CardContent>
          <UpsetChart {...args} />
        </CardContent>
      </Card>
    </StorySection>
  ),
};
