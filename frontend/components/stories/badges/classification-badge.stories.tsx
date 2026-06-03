import type { Meta, StoryObj } from '@storybook/react-vite';

import ClassificationBadge, {
  AcmgAmpClassificationMap,
  ClassificationValueMap,
} from '@/components/base/badges/classification-badge';

import { StoryLabel, StorySection } from '../story-section';

const meta = {
  title: 'Components/Badges/Classification Badge',
  component: ClassificationBadge,
  args: {
    value: 'other',
    variant: 'neutral',
  },
} satisfies Meta<typeof ClassificationBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Default">
      <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClassificationValueMap).map((key, index) => (
          <div className="flex items-center gap-2" key={key}>
            <ClassificationBadge value={key} />
            <ClassificationBadge value={key} abbreviated />
            <ClassificationBadge value={key} count={index} />
            <ClassificationBadge value={key} abbreviated count={index} />
          </div>
        ))}
      </div>
    </StorySection>
  ),
};

export const AcmgAmpClassification: Story = {
  render: () => (
    <StorySection title="ACMG/AMP classification">
      <div className="flex flex-col gap-2 items-start">
        {Object.keys(AcmgAmpClassificationMap).map((key, index) => (
          <div className="flex items-center gap-2" key={key}>
            <ClassificationBadge value={key} />
            <ClassificationBadge value={key} abbreviated />
            <ClassificationBadge value={key} count={index} />
            <ClassificationBadge value={key} abbreviated count={index} />
          </div>
        ))}
      </div>
    </StorySection>
  ),
};

export const ClassificationValueWithoutUnderscore: Story = {
  render: () => (
    <StorySection
      title="Classification value without underscore"
      description="Key without space or underscore, e.g. likelybenign"
    >
      <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClassificationValueMap).map((key, index) => (
          <div className="flex items-center gap-2" key={key}>
            <ClassificationBadge value={key.replaceAll('_', '')} />
            <ClassificationBadge value={key.replaceAll('_', '')} abbreviated />
            <ClassificationBadge value={key.replaceAll('_', '')} count={index} />
            <ClassificationBadge value={key.replaceAll('_', '')} abbreviated count={index} />
          </div>
        ))}
      </div>
    </StorySection>
  ),
};

export const ClassificationValueStartingWithAnUnderscore: Story = {
  render: () => (
    <StorySection
      title="Classification value starting with an underscore"
      description="Key starting with an underscore, e.g. _low_penetrance"
    >
      <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClassificationValueMap).map((key, index) => (
          <div className="flex items-center gap-2" key={key}>
            <ClassificationBadge value={'_' + key} />
            <ClassificationBadge value={'_' + key} abbreviated />
            <ClassificationBadge value={'_' + key} count={index} />
            <ClassificationBadge value={'_' + key} abbreviated count={index} />
          </div>
        ))}
      </div>
    </StorySection>
  ),
};

export const NoData: Story = {
  render: () => (
    <StorySection title="No data">
      <div className="space-y-2">
        <StoryLabel>With an empty string</StoryLabel>
        <div className="flex items-center gap-2">
          <ClassificationBadge value="" />
          <ClassificationBadge value="" abbreviated />
          <ClassificationBadge value="" count={1} />
          <ClassificationBadge value="" abbreviated count={1} />
        </div>
      </div>

      <div className="space-y-2">
        <StoryLabel>With a null value</StoryLabel>
        <div className="flex items-center gap-2">
          <ClassificationBadge value={null} />
          <ClassificationBadge value={null} abbreviated />
          <ClassificationBadge value={null} count={1} />
          <ClassificationBadge value={null} abbreviated count={1} />
        </div>
      </div>
    </StorySection>
  ),
};
