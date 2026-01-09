import type { Meta, StoryObj } from '@storybook/react';

import ClassificationBadge, {
  AcmgAmpClassificationMap,
  ClassificationValueMap,
} from '@/components/base/badges/classification-badge';

const meta = {
  title: 'Badges/Classification Badge',
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
  ),
};

export const AcmgAmpClassification: Story = {
  render: () => (
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
  ),
};

export const ClassificationValueWithoutUnderscore: Story = {
  render: () => (
    <div className="flex flex-col gap-2 items-start">
      <div>Key without space or underscore e.g. likelybenign</div>
      {Object.keys(ClassificationValueMap).map((key, index) => (
        <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key.replaceAll('_', '')} />
          <ClassificationBadge value={key.replaceAll('_', '')} abbreviated />
          <ClassificationBadge value={key.replaceAll('_', '')} count={index} />
          <ClassificationBadge value={key.replaceAll('_', '')} abbreviated count={index} />
        </div>
      ))}
    </div>
  ),
};

export const ClassificationValueStartingWithAnUnderscore: Story = {
  render: () => (
    <div className="flex flex-col gap-2 items-start">
      <div>Key without space or underscore e.g. _low_penetrance</div>
      {Object.keys(ClassificationValueMap).map((key, index) => (
        <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={'_' + key} />
          <ClassificationBadge value={'_' + key} abbreviated />
          <ClassificationBadge value={'_' + key} count={index} />
          <ClassificationBadge value={'_' + key} abbreviated count={index} />
        </div>
      ))}
    </div>
  ),
};

export const NoData: Story = {
  render: () => (
    <div className="flex flex-col gap-2 items-start">
      With an empty string
      <div className="flex items-center gap-2">
        <ClassificationBadge value="" />
        <ClassificationBadge value="" abbreviated />
        <ClassificationBadge value="" count={1} />
        <ClassificationBadge value="" abbreviated count={1} />
      </div>
      With an null value
      <div className="flex items-center gap-2">
        <ClassificationBadge value={null} />
        <ClassificationBadge value={null} abbreviated />
        <ClassificationBadge value={null} count={1} />
        <ClassificationBadge value={null} abbreviated count={1} />
      </div>
    </div>
  ),
};
