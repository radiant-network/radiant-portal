import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  ReadOnlyUserSelection,
  UserSelection,
  UserSelectionPopover,
} from '@/components/base/assignation/user-selection';
import { AvatarUser } from '@/components/base/avatar';

import { StoryLabel, StorySection } from '../story-section';

const meta = {
  title: 'Features/Assignation/User Selection',
  component: UserSelection,
  args: {
    availableUsers: [],
    selectedUsers: [],
    onUsersChange: () => {},
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof UserSelection>;

export default meta;

type Story = StoryObj<typeof meta>;

// Sample users for stories
const sampleUsers: AvatarUser[] = [
  {
    id: 'user-1',
    name: 'Jean-François Soucy',
    email: 'jeanfrancois.soucy.med@ssss.gouv.qc.ca',
    organization: 'LDM-CHUSJ',
  },
  {
    id: 'user-2',
    name: 'Julie M. Gauthier',
    email: 'julie.m.gauthier.hsj@ssss.gouv.qc.ca',
    organization: 'LDM-CHUSJ',
  },
  {
    id: 'user-3',
    name: 'Jacques Michaud',
    email: 'jacques.michaud.med@ssss.gouv.qc.ca',
    organization: 'LDM-CHUSJ',
  },
  {
    id: 'user-4',
    name: 'Fadi Hamdan',
    email: 'fadi.hamdan@ssss.gouv.qc.ca',
    organization: 'LDM-CHUSJ',
  },
  {
    id: 'user-5',
    name: 'Catalina Maftei',
    email: 'catalina.maftei@ssss.gouv.qc.ca',
    organization: 'LDM-CHUSJ',
  },
  {
    id: 'user-6',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@hospital.ca',
    organization: 'Toronto General',
  },
  {
    id: 'user-7',
    name: 'David Brown',
    email: 'david.brown@clinic.ca',
    organization: 'Vancouver Clinic',
  },
];

const DefaultComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([]);

  return (
    <div className="max-w-lg">
      <UserSelection availableUsers={sampleUsers} selectedUsers={selectedUsers} onUsersChange={setSelectedUsers} />
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <StorySection title="Default">
      <DefaultComponent />
    </StorySection>
  ),
};

const WithMultiplePreselectedUsersComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([
    sampleUsers[0], // Jean-François Soucy
    sampleUsers[1], // Julie M. Gauthier
    sampleUsers[2], // Jacques Michaud
  ]);

  return (
    <div className="max-w-lg">
      <UserSelection availableUsers={sampleUsers} selectedUsers={selectedUsers} onUsersChange={setSelectedUsers} />
    </div>
  );
};

export const WithMultiplePreselectedUsers: Story = {
  render: () => (
    <StorySection title="With multiple preselected users">
      <WithMultiplePreselectedUsersComponent />
    </StorySection>
  ),
};

const PopoverVersionComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([]);

  return (
    <StorySection title="User Selection Popover">
      <div className="max-w-2xl space-y-6">
        <UserSelectionPopover
          availableUsers={sampleUsers}
          selectedUsers={selectedUsers}
          onUsersChange={setSelectedUsers}
          triggerText="Assignation"
        />

        <div className="space-y-2 rounded-lg bg-muted p-4">
          <StoryLabel>État actuel:</StoryLabel>
          <p className="text-sm text-muted-foreground">
            {selectedUsers.length === 0
              ? 'Aucun utilisateur sélectionné'
              : `${selectedUsers.length} utilisateur(s) sélectionné(s): ${selectedUsers.map(u => u.name).join(', ')}`}
          </p>
        </div>
      </div>
    </StorySection>
  );
};

export const PopoverVersion: Story = {
  render: () => <PopoverVersionComponent />,
};

const InteractiveComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([]);

  return (
    <StorySection title="User Selection Demo">
      <div className="max-w-2xl space-y-6">
        <UserSelection availableUsers={sampleUsers} selectedUsers={selectedUsers} onUsersChange={setSelectedUsers} />

        <div className="space-y-2 rounded-lg bg-muted p-4">
          <StoryLabel>État actuel:</StoryLabel>
          <p className="text-sm text-muted-foreground">
            {selectedUsers.length === 0
              ? 'Aucun utilisateur sélectionné'
              : `${selectedUsers.length} utilisateur(s) sélectionné(s): ${selectedUsers.map(u => u.name).join(', ')}`}
          </p>
        </div>
      </div>
    </StorySection>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveComponent />,
};

// ReadOnlyUserSelection Stories
export const ReadOnlyMultipleUsers: Story = {
  render: () => (
    <StorySection title="Read-Only User Selection (Multiple Users)">
      <div className="max-w-lg space-y-4">
        <ReadOnlyUserSelection selectedUsers={[sampleUsers[0], sampleUsers[1], sampleUsers[2]]} />
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Selected Users:</strong>
          </p>
          <ul className="ml-2 list-inside list-disc">
            {[sampleUsers[0], sampleUsers[1], sampleUsers[2]].map(user => (
              <li key={user.id}>
                {user.name} ({user.organization})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StorySection>
  ),
};

export const ReadOnlyComparison: Story = {
  render: () => {
    const selectedUsers = [sampleUsers[0], sampleUsers[1]];

    return (
      <StorySection title="Editable vs Read-Only Comparison">
        <div className="max-w-2xl space-y-4">
          <div className="space-y-1">
            <StoryLabel>Read-Only Version</StoryLabel>
            <ReadOnlyUserSelection selectedUsers={selectedUsers} />
            <p className="text-sm text-muted-foreground">No interaction possible - display only</p>
          </div>

          <div className="space-y-1">
            <StoryLabel>Editable Version</StoryLabel>
            <UserSelection
              availableUsers={sampleUsers}
              selectedUsers={selectedUsers}
              onUsersChange={() => {}} // No-op for demo
            />
            <p className="text-sm text-muted-foreground">Interactive - allows searching and removing users</p>
          </div>
        </div>
      </StorySection>
    );
  },
};
