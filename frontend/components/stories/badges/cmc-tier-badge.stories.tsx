import type { Meta, StoryObj } from '@storybook/react-vite';

import CmcTierBadge from '@/components/base/badges/cmc-tier-badge';
import { getFranklinSnvUrl } from '@/components/base/variant/utils';

import { StoryLabel, StorySection } from '../story-section';

const CMC_TIERS = ['1', '2', '3', 'Other'];
const FRANKLIN_URL = getFranklinSnvUrl('22-19524402-G-A');

const meta = {
  title: 'Components/Badges/CMC Tier Badge',
  component: CmcTierBadge,
  args: {
    value: '1',
  },
} satisfies Meta<typeof CmcTierBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Default">
      <div className="flex items-center gap-2">
        {CMC_TIERS.map(tier => (
          <CmcTierBadge key={tier} value={tier} />
        ))}
      </div>
    </StorySection>
  ),
};

export const WithFranklinLink: Story = {
  render: () => (
    <StorySection title="With Franklin link" description="Opens Franklin in a new tab">
      <div className="flex items-center gap-2">
        {CMC_TIERS.map(tier => (
          <CmcTierBadge key={tier} value={tier} href={FRANKLIN_URL} />
        ))}
      </div>
    </StorySection>
  ),
};

export const NoData: Story = {
  render: () => (
    <StorySection title="No data">
      <div className="space-y-2">
        <StoryLabel>Without link</StoryLabel>
        <CmcTierBadge value={undefined} />
      </div>
      <div className="space-y-2">
        <StoryLabel>With link (never clickable)</StoryLabel>
        <CmcTierBadge value={undefined} href={FRANKLIN_URL} />
      </div>
    </StorySection>
  ),
};
