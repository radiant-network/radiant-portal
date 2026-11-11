import type { Meta, StoryObj } from '@storybook/react';
import VennChart from '@/components/base/charts/venn-charts/venn-chart';
import { StorySection } from '../story-section';
import { vennTwoSetsData, vennThreeSetsDisaled, vennThreeSetsData, vennTwoSetsDisabled } from './data';

const meta = {
  title: 'Components/Charts/VennChart',
  component: VennChart,
  args: {},
} satisfies Meta<typeof VennChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TwoSets: Story = {
  args: {
    summary: vennTwoSetsData.summary,
    operations: vennTwoSetsData.operations,
  },
  render: args => (
    <StorySection title="VennChart">
      <VennChart {...args} />
    </StorySection>
  ),
};

export const ThreeSets: Story = {
  args: {
    summary: vennThreeSetsData.summary,
    operations: vennThreeSetsData.operations,
  },
  render: args => (
    <StorySection title="VennChart">
      <VennChart {...args} />
    </StorySection>
  ),
};

export const TwoSetsWithDisable: Story = {
  args: {
    summary: vennTwoSetsDisabled.summary,
    operations: vennTwoSetsDisabled.operations,
  },
  render: args => (
    <StorySection title="VennChart">
      <VennChart {...args} />
    </StorySection>
  ),
};

export const ThreeSetsWithDisable: Story = {
  args: {
    summary: vennThreeSetsDisaled.summary,
    operations: vennThreeSetsDisaled.operations,
  },
  render: args => (
    <StorySection title="VennChart">
      <VennChart {...args} />
    </StorySection>
  ),
};
