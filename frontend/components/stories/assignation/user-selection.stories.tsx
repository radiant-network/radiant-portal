import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { AvatarUser } from '@/components/base/assignation/avatar';
import {
  ReadOnlyUserSelection,
  UserSelection,
  UserSelectionPopover,
} from '@/components/base/assignation/user-selection';

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

// ReadOnlyUserSelection Stories
export const ReadOnlyEmpty: Story = {
  render: () => (
    <div className="max-w-lg space-y-4">
      <h3 className="text-lg font-semibold">Read-Only User Selection (Empty)</h3>
      <ReadOnlyUserSelection selectedUsers={[]} />
      <p className="text-sm text-gray-600">Note: Component returns null when no users are selected</p>
    </div>
  ),
};

export const ReadOnlySingleUser: Story = {
  render: () => (
    <div className="max-w-lg space-y-4">
      <h3 className="text-lg font-semibold">Read-Only User Selection (Single User)</h3>
      <ReadOnlyUserSelection selectedUsers={[sampleUsers[0]]} />
      <div className="text-sm text-gray-600">
        <p>
          <strong>Selected:</strong> {sampleUsers[0].name}
        </p>
        <p>
          <strong>Organization:</strong> {sampleUsers[0].organization}
        </p>
      </div>
    </div>
  ),
};

export const ReadOnlyMultipleUsers: Story = {
  render: () => (
    <div className="max-w-lg space-y-4">
      <h3 className="text-lg font-semibold">Read-Only User Selection (Multiple Users)</h3>
      <ReadOnlyUserSelection selectedUsers={[sampleUsers[0], sampleUsers[1], sampleUsers[2]]} />
      <div className="text-sm text-gray-600">
        <p>
          <strong>Selected Users:</strong>
        </p>
        <ul className="list-disc list-inside ml-2">
          {[sampleUsers[0], sampleUsers[1], sampleUsers[2]].map(user => (
            <li key={user.id}>
              {user.name} ({user.organization})
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),
};

export const ReadOnlyWithNotAssigned: Story = {
  render: () => {
    const notAssignUser: AvatarUser = {
      id: 'not-assign',
      name: 'Not assigned',
      organization: '',
    };

    return (
      <div className="max-w-lg space-y-4">
        <h3 className="text-lg font-semibold">Read-Only User Selection (Not Assigned)</h3>
        <ReadOnlyUserSelection selectedUsers={[notAssignUser]} />
        <div className="text-sm text-gray-600">
          <p>
            <strong>Status:</strong> No assignment
          </p>
          <p>Shows the unassigned state with the user icon</p>
        </div>
      </div>
    );
  },
};

export const ReadOnlyMixedUsers: Story = {
  render: () => {
    const notAssignUser: AvatarUser = {
      id: 'not-assign',
      name: 'Not assigned',
      organization: '',
    };

    return (
      <div className="max-w-lg space-y-4">
        <h3 className="text-lg font-semibold">Read-Only User Selection (Mixed)</h3>
        <ReadOnlyUserSelection selectedUsers={[sampleUsers[0], notAssignUser, sampleUsers[2]]} />
        <div className="text-sm text-gray-600">
          <p>
            <strong>Note:</strong> Shows mix of assigned users and unassigned state
          </p>
          <p>Demonstrates the different avatar styles in read-only mode</p>
        </div>
      </div>
    );
  },
};

export const ReadOnlyComparison: Story = {
  render: () => {
    const selectedUsers = [sampleUsers[0], sampleUsers[1]];

    return (
      <div className="max-w-2xl space-y-6">
        <h3 className="text-lg font-semibold">Editable vs Read-Only Comparison</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Read-Only Version:</h4>
            <ReadOnlyUserSelection selectedUsers={selectedUsers} />
            <p className="text-sm text-gray-500 mt-1">No interaction possible - display only</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Editable Version:</h4>
            <UserSelection
              availableUsers={sampleUsers}
              selectedUsers={selectedUsers}
              onUsersChange={() => {}} // No-op for demo
            />
            <p className="text-sm text-gray-500 mt-1">Interactive - allows searching and removing users</p>
          </div>
        </div>
      </div>
    );
  },
};
