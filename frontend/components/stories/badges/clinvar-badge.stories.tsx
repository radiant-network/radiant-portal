import type { Meta, StoryObj } from '@storybook/react';
import ClinVarBadge, { ClinVarValueMap } from '@/components/feature/variant/clinvar-badge';

const meta = {
  title: 'Badges/ClinVar Badge',
  component: ClinVarBadge,
  args: {
    value: 'other',
    variant: 'neutral',
  },
} satisfies Meta<typeof ClinVarBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClinVarValueMap).map(key => (
          <div className="flex items-center gap-2" key={key}>
            <ClinVarBadge value={key} />
            <ClinVarBadge value={key} abbreviated />
          </div>
        ))}
      </div>
    );
  },
};

export const NoData: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center gap-2">
          <ClinVarBadge value="" />
          <ClinVarBadge value="" abbreviated />
        </div>
      </div>
    );
  },
};
