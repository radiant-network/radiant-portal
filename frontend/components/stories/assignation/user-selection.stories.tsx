import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { AvatarUser } from '@/components/base/assignation/avatar';
import { UserSelection, UserSelectionPopover } from '@/components/base/assignation/user-selection';

const meta = {
  title: 'Assignation/UserSelection',
  component: UserSelection,
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
  render: () => <DefaultComponent />,
};

const WithPreselectedUsersComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([
    sampleUsers[0], // Jean-François Soucy
  ]);

  return (
    <div className="max-w-lg">
      <UserSelection availableUsers={sampleUsers} selectedUsers={selectedUsers} onUsersChange={setSelectedUsers} />
    </div>
  );
};

export const WithPreselectedUsers: Story = {
  render: () => <WithPreselectedUsersComponent />,
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
  render: () => <WithMultiplePreselectedUsersComponent />,
};

const PopoverVersionComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([]);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">User Selection Popover</h3>
        <UserSelectionPopover
          availableUsers={sampleUsers}
          selectedUsers={selectedUsers}
          onUsersChange={setSelectedUsers}
          triggerText="Assignation"
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">État actuel:</h4>
        <p className="text-sm text-gray-600">
          {selectedUsers.length === 0
            ? 'Aucun utilisateur sélectionné'
            : `${selectedUsers.length} utilisateur(s) sélectionné(s): ${selectedUsers.map(u => u.name).join(', ')}`}
        </p>
      </div>
    </div>
  );
};

export const PopoverVersion: Story = {
  render: () => <PopoverVersionComponent />,
};

const InteractiveComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([]);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">User Selection Demo</h3>
        <UserSelection availableUsers={sampleUsers} selectedUsers={selectedUsers} onUsersChange={setSelectedUsers} />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">État actuel:</h4>
        <p className="text-sm text-gray-600">
          {selectedUsers.length === 0
            ? 'Aucun utilisateur sélectionné'
            : `${selectedUsers.length} utilisateur(s) sélectionné(s): ${selectedUsers.map(u => u.name).join(', ')}`}
        </p>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveComponent />,
};
