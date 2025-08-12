import type { Meta, StoryObj } from '@storybook/react';
import ImpactIndicator from '@/components/base/indicators/impact-indicator';
import { VepImpact } from '@/api/api';

const meta = {
  title: 'Indicators/Impact Indicator',
  component: ImpactIndicator,
  args: {
    value: 'HIGH',
  },
} satisfies Meta<typeof ImpactIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2">
        {Object.keys(VepImpact).map(impact => (
          <ImpactIndicator key={impact} value={impact as VepImpact}>
            {impact.toLowerCase()}
          </ImpactIndicator>
        ))}
      </div>
    );
  },
};
