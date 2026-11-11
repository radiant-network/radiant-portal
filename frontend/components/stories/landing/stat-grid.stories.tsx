import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpenText, Dna, FileText, FlaskConical, TestTube, Users } from 'lucide-react';

import StatGrid, { type StatGridItem } from '@/components/base/landing/stat-grid';

import { StorySection, StoryShowcase } from '../story-section';

const items: StatGridItem[] = [
  { key: 'studies', icon: <BookOpenText />, value: '8', label: 'Studies' },
  { key: 'participants', icon: <Users />, value: '11K', label: 'Participants' },
  { key: 'variants', icon: <FlaskConical />, value: '39M+', label: 'Variants' },
  { key: 'biospecimens', icon: <TestTube />, value: '16.3K', label: 'Biospecimens' },
  { key: 'files', icon: <FileText />, value: '680.4 TB', label: 'Files' },
  { key: 'genomes', icon: <Dna />, value: '9,121', label: 'Genomes' },
];

const meta = {
  title: 'Components/Landing/Stat Grid',
  component: StatGrid,
  args: { items },
} satisfies Meta<typeof StatGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Three columns (default usage)">
        <StatGrid items={items} className="grid-cols-2 sm:grid-cols-3" />
      </StorySection>

      <StorySection
        title="On a colored background (icon / label overrides)"
        description="Override icon and label colors so the figures read well on a dark surface."
      >
        <div className="bg-primary text-primary-foreground rounded-md p-6">
          <StatGrid
            items={items}
            className="grid-cols-2 sm:grid-cols-3"
            iconClassName="text-primary-foreground"
            labelClassName="text-primary-foreground/90"
          />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};
