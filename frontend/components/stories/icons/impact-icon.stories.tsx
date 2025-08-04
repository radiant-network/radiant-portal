import type { Meta, StoryObj } from '@storybook/react';
import ImpactIcon from '@/components/feature/variant/impact-icon';
import { VepImpact } from '@/api/api';

const meta = {
  title: 'Icons/Impact Icon',
  component: ImpactIcon,
  args: {
    value: 'HIGH',
  },
} satisfies Meta<typeof ImpactIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2">
        {Object.keys(VepImpact).map(impact => (
          <div key={impact} className="flex items-center gap-2">
            <ImpactIcon value={impact as VepImpact} />
            {impact.toLowerCase()}
          </div>
        ))}
      </div>
    );
  },
};
