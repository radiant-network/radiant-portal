import type { Meta, StoryObj } from '@storybook/react-vite';

import PedigreeDiagram, { type PedigreeMember } from '@/components/base/pedigree/pedigree-diagram';

import { StorySection, StoryShowcase } from '../story-section';

const proband: PedigreeMember = {
  key: 'proband',
  label: 'Proband',
  sublabel: 'DM189234',
  sex: 'male',
  isProband: true,
  isAffected: true,
};
const father: PedigreeMember = { key: 'father', label: 'Father', sublabel: 'DM189236', sex: 'male' };
const mother: PedigreeMember = { key: 'mother', label: 'Mother', sublabel: 'DM189235', sex: 'female' };
const sister: PedigreeMember = { key: 'sister', label: 'Sister', sublabel: 'DM189237', sex: 'female' };
const brother: PedigreeMember = { key: 'brother', label: 'Brother', sublabel: 'DM189238', sex: 'male' };

const LEGEND: PedigreeMember[] = [
  { key: 'male', label: 'Male', sex: 'male' },
  { key: 'male-affected', label: 'Male, affected', sex: 'male', isAffected: true },
  { key: 'female', label: 'Female', sex: 'female' },
  { key: 'female-affected', label: 'Female, affected', sex: 'female', isAffected: true },
  { key: 'unknown', label: 'Unknown sex', sex: 'unknown' },
  { key: 'unknown-affected', label: 'Unknown sex, affected', sex: 'unknown', isAffected: true },
  { key: 'not-sequenced', label: 'Not sequenced', sex: 'male', isSequenced: false },
  { key: 'proband', label: 'Proband', sex: 'male', isProband: true, isAffected: true },
  { key: 'failed', label: 'Failed check', sex: 'female', status: 'error' },
];

const meta = {
  title: 'Components/Pedigree Diagram',
  component: PedigreeDiagram,
  args: {
    father,
    mother,
    offspring: [proband],
  },
} satisfies Meta<typeof PedigreeDiagram>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <StoryShowcase>
      <StorySection title="Diagram" description="Editable in the controls.">
        <PedigreeDiagram {...args} />
      </StorySection>

      <StorySection title="Legend" description="Each symbol of the diagram, drawn alone.">
        <div className="flex flex-wrap gap-8">
          {LEGEND.map(member => (
            <PedigreeDiagram key={member.key} offspring={[member]} />
          ))}
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase direction="row">
      <StorySection title="Trio">
        <PedigreeDiagram father={father} mother={mother} offspring={[proband]} />
      </StorySection>

      <StorySection title="Family of four">
        <PedigreeDiagram father={father} mother={mother} offspring={[proband, sister]} />
      </StorySection>

      <StorySection title="Mother and sibling" description="The father is drawn but not sequenced.">
        <PedigreeDiagram
          father={{ ...father, sublabel: 'Not sequenced', isSequenced: false }}
          mother={mother}
          offspring={[proband, sister]}
        />
      </StorySection>

      <StorySection title="Identity check failure" description="The father fails an identity check.">
        <PedigreeDiagram father={{ ...father, status: 'error' }} mother={mother} offspring={[proband, sister]} />
      </StorySection>

      <StorySection title="Fetus" description="The proband is a fetus: unknown sex.">
        <PedigreeDiagram
          father={father}
          mother={mother}
          offspring={[{ ...proband, label: 'Proband', sublabel: 'Fetus · DM189234', sex: 'unknown' }]}
        />
      </StorySection>

      <StorySection title="Three children">
        <PedigreeDiagram father={father} mother={mother} offspring={[proband, sister, brother]} />
      </StorySection>
    </StoryShowcase>
  ),
};
