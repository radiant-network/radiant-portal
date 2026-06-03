import type { Meta, StoryObj } from '@storybook/react-vite';

import TransmissionModeBadge, { getTransmissionModeList } from '@/components/base/badges/transmission-mode-badge';
import { useI18n } from '@/components/hooks/i18n';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Badges/Transmission Mode Badge',
  component: TransmissionModeBadge,
  args: {
    value: 'other',
    variant: 'neutral',
  },
} satisfies Meta<typeof TransmissionModeBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = useI18n();
    const list = getTransmissionModeList(t);
    return (
      <StorySection title="Default">
        <div className="flex flex-col gap-2 items-start">
          {list.map(transmission => (
            <div key={transmission.value}>
              <TransmissionModeBadge value={transmission.value} />
            </div>
          ))}
        </div>
      </StorySection>
    );
  },
};
