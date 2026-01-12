import type { Meta, StoryObj } from '@storybook/react';

import TransmissionModeBadge, { getTransmissionModeList } from '@/components/base/badges/transmission-mode-badge';

const meta = {
  title: 'Badges/Transmission Mode Badge',
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
    // eslint-disable-next-line prettier/prettier
    const list = getTransmissionModeList(() => { });
    return (
      <div className="flex flex-col gap-2 items-start">
        {list.map(transmission => (
          <div key={transmission.value}>
            <TransmissionModeBadge value={transmission.value} />
          </div>
        ))}
      </div>
    );
  },
};
