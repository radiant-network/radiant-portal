import type { Meta, StoryObj } from '@storybook/react';
import { VepImpact } from '@/api/api';
import ConsequenceLabel from '@/components/feature/variant/consequence-label';

const meta = {
  title: 'Feature/Variant/Consequence Label',
  component: ConsequenceLabel,
  args: {
    vepImpact: 'HIGH',
    consequence: 'missense_variant',
    size: 'default',
  },
} satisfies Meta<typeof ConsequenceLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <label>Size: default</label>
          {Object.keys(VepImpact).map(impact => (
            <ConsequenceLabel key={impact} vepImpact={impact as VepImpact} consequence="Consequence" />
          ))}
        </div>
        <div className="space-y-2">
          <label>Size: sm</label>
          {Object.keys(VepImpact).map(impact => (
            <ConsequenceLabel key={impact} size="sm" vepImpact={impact as VepImpact} consequence="Consequence" />
          ))}
        </div>
      </div>
    );
  },
};
