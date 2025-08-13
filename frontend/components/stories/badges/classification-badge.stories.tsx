import type { Meta, StoryObj } from '@storybook/react';

import ClassificationBadge, { ClassificationValueMap } from '@/components/base/badges/classification-badge';

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

export const NoData: Story = {
  render: () => (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex items-center gap-2">
        <ClassificationBadge value="" />
        <ClassificationBadge value="" abbreviated />
        <ClassificationBadge value="" count={1} />
        <ClassificationBadge value="" abbreviated count={1} />
      </div>
    </div>
  ),
};
