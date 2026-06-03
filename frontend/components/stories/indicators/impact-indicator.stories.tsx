import type { Meta, StoryObj } from '@storybook/react-vite';

import { VepImpact } from '@/api/api';
import ImpactIndicator from '@/components/base/indicators/impact-indicator';

import { StorySection } from '../story-section';

const meta = {
  title: 'Features/Indicators/Impact Indicator',
  component: ImpactIndicator,
  args: {
    value: 'HIGH',
  },
} satisfies Meta<typeof ImpactIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Impact indicator">
      <div className="flex flex-col gap-2">
        {Object.keys(VepImpact).map(impact => (
          <div key={impact}>
            <ImpactIndicator value={impact as VepImpact}>{impact.toLowerCase()}</ImpactIndicator>
            <ImpactIndicator value={impact as VepImpact} size="sm">
              {impact.toLowerCase()}
            </ImpactIndicator>
          </div>
        ))}
      </div>
    </StorySection>
  ),
};
