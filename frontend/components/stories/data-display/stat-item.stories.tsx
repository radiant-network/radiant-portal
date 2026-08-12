import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpenText, FileText, FlaskConical, User, Users, UsersRound } from 'lucide-react';

import StatItem, { StatItemLayout } from '@/components/base/stat-item/stat-item';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Stat Item',
  component: StatItem,
  args: {
    icon: <Users />,
    value: '13,500',
    label: 'Participants',
  },
} satisfies Meta<typeof StatItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const dataExplorationStats = [
  { icon: <BookOpenText />, value: '7', label: 'Studies' },
  { icon: <User />, value: '8,559', label: 'Participants' },
  { icon: <UsersRound />, value: '2,322', label: 'Families' },
  { icon: <FlaskConical />, value: '13.2K', label: 'Biospecimens' },
  { icon: <FileText />, value: '313K', label: 'Data Files' },
];

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="With icon">
        <StatItem icon={<FlaskConical />} value="17" label="Studies" />
      </StorySection>

      <StorySection title="Without icon">
        <StatItem value="121,540" label="Files" />
      </StorySection>

      <StorySection title="Inline layout (icon + value + label on one centered line)">
        <StatItem layout={StatItemLayout.Inline} icon={<Users />} value="13,500" label="Participants" />
      </StorySection>

      <StorySection title="Sizes (md default / lg)">
        <div className="flex items-center gap-12">
          <StatItem size="md" icon={<Users />} value="13,500" label="Participants" />
          <StatItem size="lg" icon={<Users />} value="13,500" label="Participants" />
        </div>
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

      <StorySection
        title="In bordered cells on a dark panel"
        description="Data exploration band: each stat gets its own bordered cell, the icon keeping an accent distinct from the value."
      >
        <div className="bg-primary text-primary-foreground w-full space-y-3 rounded-md p-4">
          <span className="text-sm font-semibold">Data Exploration</span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {dataExplorationStats.map(stat => (
              <div key={stat.label} className="border-primary-foreground/20 rounded-sm border p-3">
                <StatItem
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  iconClassName="text-primary-foreground"
                  labelClassName="text-primary-foreground/90"
                />
              </div>
            ))}
          </div>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};
