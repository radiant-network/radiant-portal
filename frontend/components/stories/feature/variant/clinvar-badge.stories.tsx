import type { Meta, StoryObj } from '@storybook/react';
import ClinVarBadge, { ClinVarValueMap } from '@/components/feature/variant/clinvar-badge';

const meta = {
  title: 'Feature/Variant/ClinVar Badge',
  component: ClinVarBadge,
  args: {
    value: 'other',
    variant: 'slate',
  },
} satisfies Meta<typeof ClinVarBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClinVarValueMap).map(key => (
          <ClinVarBadge value={key} />
        ))}
      </div>
    );
  },
};
