import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText, FlaskConical, Users } from 'lucide-react';

import StatItem from '@/components/base/stat-item/stat-item';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Stat Item/Stat Item',
  component: StatItem,
  args: {
    icon: <Users />,
    value: '13,500',
    label: 'Participants',
  },
} satisfies Meta<typeof StatItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="With icon">
        <StatItem icon={<FlaskConical />} value="17" label="Studies" />
      </StorySection>

      <StorySection title="Without icon">
        <StatItem value="121,540" label="Files" />
      </StorySection>

      <StorySection title="In a grid">
        <div className="grid grid-cols-3 gap-6">
          <StatItem icon={<Users />} value="13,500" label="Participants" />
          <StatItem icon={<FlaskConical />} value="17" label="Studies" />
          <StatItem icon={<FileText />} value="121,540" label="Files" />
        </div>
      </StorySection>

      <StorySection
        title="On a colored background (iconClassName / labelClassName)"
        description="Override icon and label colors so the stat reads well on a dark surface."
      >
        <div className="bg-primary text-primary-foreground inline-flex rounded-md p-6">
          <StatItem
            icon={<FlaskConical />}
            value="38"
            label="Studies"
            iconClassName="text-primary-foreground"
            labelClassName="text-primary-foreground/90"
          />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};
