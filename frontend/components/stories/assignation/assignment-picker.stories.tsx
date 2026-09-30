import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import AssignmentPicker from '@/components/base/assignation/assignment-picker';
import type { AvatarUser } from '@/components/base/avatar';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const CURRENT_USER_ID = 'user-1';

const candidates: AvatarUser[] = [
  { id: CURRENT_USER_ID, name: 'Vincent Ferretti', email: 'vincent.ferretti.hsj@ssss.gouv.qc.ca' },
  { id: 'user-2', name: 'Sophie Dubois', email: 'sdubois.hsj@ssss.gouv.qc.ca' },
  { id: 'user-3', name: 'Clément Jourdain', email: 'cjourdain.hsj@ssss.gouv.qc.ca' },
  { id: 'user-4', name: 'Amélie Lefebvre', email: 'alefebvre.hsj@ssss.gouv.qc.ca' },
  { id: 'user-5', name: 'Alexandre Martel', email: 'amartel.hsj@ssss.gouv.qc.ca' },
  { id: 'user-6', name: 'Benoît Moreau', email: 'bmoreau.hsj@ssss.gouv.qc.ca' },
  { id: 'user-7', name: 'Jean-François Soucy', email: 'jfsoucy.hsj@ssss.gouv.qc.ca' },
];

const meta = {
  title: 'Features/Assignation/Assignment Picker',
  component: AssignmentPicker,
  args: {
    candidates,
    assignees: [],
    onApply: () => {},
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof AssignmentPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

type DemoProps = {
  label: string;
  initialAssignees?: AvatarUser[];
  candidates?: AvatarUser[];
  canEdit?: boolean;
  currentUserId?: string;
  isLoading?: boolean;
};

function Demo({
  label,
  initialAssignees = [],
  candidates: demoCandidates = candidates,
  canEdit,
  currentUserId = CURRENT_USER_ID,
  isLoading,
}: DemoProps) {
  const [assignees, setAssignees] = useState<AvatarUser[]>(initialAssignees);

  return (
    <div className="flex flex-col items-start gap-2">
      <StoryLabel>{label}</StoryLabel>
      <AssignmentPicker
        candidates={demoCandidates}
        assignees={assignees}
        canEdit={canEdit}
        currentUserId={currentUserId}
        isLoading={isLoading}
        align="start"
        onApply={setAssignees}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Editable"
        description="Click to open the picker. Apply appears once the selection changes; closing without applying discards it."
      >
        <div className="flex gap-12">
          <Demo label="Unassigned" />
          <Demo label="One assignee" initialAssignees={[candidates[1]]} />
          <Demo label="Several assignees" initialAssignees={[candidates[1], candidates[3], candidates[4]]} />
        </div>
      </StorySection>
      <StorySection title="Read-only" description="Without can_edit_case: details on hover, no picker.">
        <div className="flex gap-12">
          <Demo label="Unassigned" canEdit={false} />
          <Demo label="Assigned" canEdit={false} initialAssignees={[candidates[1], candidates[3]]} />
        </div>
      </StorySection>
      <StorySection title="Picker states">
        <div className="flex gap-12">
          <Demo label="Caller not eligible (no “you”)" currentUserId="user-unknown" />
          <Demo label="Loading" isLoading />
          <Demo label="No candidates" candidates={[]} />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};
