import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { AvatarUser } from '@/components/base/assignation/avatar';
import { TableHeaderUserFilter } from '@/components/base/assignation/user-selection';

const meta = {
  title: 'Assignation/TableHeaderUserFilter',
  component: TableHeaderUserFilter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A filter component for table headers that allows users to select multiple users with checkboxes. Changes are staged and applied only when the Filter button is clicked.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    availableUsers: {
      description: 'Array of available users to choose from',
      control: { type: 'object' },
    },
    selectedUsers: {
      description: 'Array of currently selected/filtered users',
      control: { type: 'object' },
    },
    onUsersChange: {
      description: 'Callback function called when filter is applied',
      action: 'users changed',
    },
    defaultUser: {
      description: 'Optional default/current user to show at top of list',
      control: { type: 'object' },
    },
    placeholder: {
      description: 'Placeholder text for search input',
      control: { type: 'text' },
    },
    className: {
      description: 'Additional CSS classes',
      control: { type: 'text' },
    },
    isOpen: {
      description: 'Whether the filter dropdown is open',
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof TableHeaderUserFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockUsers: AvatarUser[] = [
  {
    id: '1',
    name: 'Jean-François Soucy',
    email: 'jeanfrancois.soucy.med@ssss.gouv.qc.ca',
    organization: 'LDM-CHUSJ',
  },
  {
    id: '2',
    name: 'Catalina Maftei',
    email: 'catalina.maftei@ssss.gouv.qc.ca',
    organization: 'LDM-CHUSJ',
  },
  {
    id: '3',
    name: 'Julie M. Gauthier',
    email: 'julie.m.gauthier.hsj@ssss.gouv.qc.ca',
    organization: 'LDM-CHUSJ',
  },
  {
    id: '4',
    name: 'Fadi Hamdan',
    email: 'fadi.hamdan@ssss.gouv.qc.ca',
    organization: 'LDM-CHUSJ',
  },
  {
    id: '5',
    name: 'Jacques Michaud',
    email: 'jacques.michaud.med@ssss.gouv.qc.ca',
    organization: 'LDM-CHUSJ',
  },
  {
    id: '6',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@hospital.ca',
    organization: 'Hospital General',
  },
  {
    id: '7',
    name: 'David Chen',
    email: 'david.chen@medical.ca',
    organization: 'Medical Center',
  },
  {
    id: '8',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@research.ca',
    organization: 'Research Institute',
  },
];

const defaultUser: AvatarUser = {
  id: 'current',
  name: 'Current User',
  email: 'current.user@organization.ca',
  organization: 'My Organization',
};

// Default filter with no users selected
const DefaultComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([]);

  return (
    <div style={{ width: '320px' }}>
      <TableHeaderUserFilter
        availableUsers={mockUsers}
        selectedUsers={selectedUsers}
        onUsersChange={setSelectedUsers}
        placeholder="Search users..."
        isOpen={true}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};

// Filter with some users pre-selected
const WithPreselectedUsersComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([mockUsers[0], mockUsers[2]]);

  return (
    <div style={{ width: '320px' }}>
      <TableHeaderUserFilter
        availableUsers={mockUsers}
        selectedUsers={selectedUsers}
        onUsersChange={setSelectedUsers}
        placeholder="Search users..."
        isOpen={true}
      />
    </div>
  );
};

export const WithPreselectedUsers: Story = {
  render: () => <WithPreselectedUsersComponent />,
};

// Filter with default/current user option
const WithDefaultUserComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([]);

  return (
    <div style={{ width: '320px' }}>
      <TableHeaderUserFilter
        availableUsers={mockUsers}
        selectedUsers={selectedUsers}
        onUsersChange={setSelectedUsers}
        defaultUser={defaultUser}
        placeholder="Search users..."
        isOpen={true}
      />
    </div>
  );
};

export const WithDefaultUser: Story = {
  render: () => <WithDefaultUserComponent />,
};

// Filter with "Not assigned" selected
const WithNotAssignedComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([
    { id: 'not-assign', name: 'Not assigned', organization: '' },
  ]);

  return (
    <div style={{ width: '320px' }}>
      <TableHeaderUserFilter
        availableUsers={mockUsers}
        selectedUsers={selectedUsers}
        onUsersChange={setSelectedUsers}
        placeholder="Search users..."
        isOpen={true}
      />
    </div>
  );
};

export const WithNotAssigned: Story = {
  render: () => <WithNotAssignedComponent />,
};

// Filter with many users selected showing the staged selection behavior
const WithManySelectedComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([
    mockUsers[0],
    mockUsers[1],
    mockUsers[2],
    mockUsers[3],
  ]);

  return (
    <div style={{ width: '320px' }}>
      <TableHeaderUserFilter
        availableUsers={mockUsers}
        selectedUsers={selectedUsers}
        onUsersChange={setSelectedUsers}
        placeholder="Search users..."
        isOpen={true}
      />
    </div>
  );
};

export const WithManySelected: Story = {
  render: () => <WithManySelectedComponent />,
};

// Closed filter state
const ClosedComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([mockUsers[0]]);

  return (
    <div style={{ width: '320px' }}>
      <TableHeaderUserFilter
        availableUsers={mockUsers}
        selectedUsers={selectedUsers}
        onUsersChange={setSelectedUsers}
        placeholder="Search users..."
        isOpen={false}
      />
    </div>
  );
};

export const Closed: Story = {
  render: () => <ClosedComponent />,
};

// Filter with custom placeholder
const CustomPlaceholderComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([]);

  return (
    <div style={{ width: '320px' }}>
      <TableHeaderUserFilter
        availableUsers={mockUsers}
        selectedUsers={selectedUsers}
        onUsersChange={setSelectedUsers}
        placeholder="Filter by assignee..."
        isOpen={true}
      />
    </div>
  );
};

export const CustomPlaceholder: Story = {
  render: () => <CustomPlaceholderComponent />,
};

// Filter with fewer users to show different list size
const SmallUserListComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([]);

  return (
    <div style={{ width: '320px' }}>
      <TableHeaderUserFilter
        availableUsers={mockUsers.slice(0, 3)}
        selectedUsers={selectedUsers}
        onUsersChange={setSelectedUsers}
        placeholder="Search users..."
        isOpen={true}
      />
    </div>
  );
};

export const SmallUserList: Story = {
  render: () => <SmallUserListComponent />,
};

// Interactive demonstration showing the staged selection workflow
const InteractiveDemoComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<AvatarUser[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<AvatarUser[]>([]);

  const handleUsersChange = (users: AvatarUser[]) => {
    setSelectedUsers(users);
    setAppliedFilters(users); // For demo, also update applied filters
  };

  return (
    <div style={{ width: '400px', padding: '20px' }}>
      <h3 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>Table Header User Filter Demo</h3>
      <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        Select users with checkboxes, then click Filter to apply. The Reset button clears all selections.
      </p>

      <TableHeaderUserFilter
        availableUsers={mockUsers}
        selectedUsers={selectedUsers}
        onUsersChange={handleUsersChange}
        defaultUser={defaultUser}
        placeholder="Filter by user..."
        isOpen={true}
      />

      {appliedFilters.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            Applied Filters ({appliedFilters.length}):
          </p>
          <ul style={{ fontSize: '12px', margin: 0, paddingLeft: '20px' }}>
            {appliedFilters.map(user => (
              <li key={user.id}>
                {user.name} {user.organization && `(${user.organization})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo showing how users can stage selections and apply filters. Try checking different users and clicking the Filter button.',
      },
    },
  },
};

// Component in different container sizes to show responsiveness
const ResponsiveSizesComponent = () => (
  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
    <div style={{ width: '250px' }}>
      <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Narrow (250px)</h4>
      <TableHeaderUserFilter
        availableUsers={mockUsers.slice(0, 4)}
        selectedUsers={[]}
        onUsersChange={() => {}}
        placeholder="Search..."
        isOpen={true}
      />
    </div>
    <div style={{ width: '320px' }}>
      <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Standard (320px)</h4>
      <TableHeaderUserFilter
        availableUsers={mockUsers}
        selectedUsers={[mockUsers[0]]}
        onUsersChange={() => {}}
        placeholder="Search users..."
        isOpen={true}
      />
    </div>
    <div style={{ width: '400px' }}>
      <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Wide (400px)</h4>
      <TableHeaderUserFilter
        availableUsers={mockUsers}
        selectedUsers={[mockUsers[0], mockUsers[2]]}
        onUsersChange={() => {}}
        placeholder="Filter by assignee..."
        isOpen={true}
      />
    </div>
  </div>
);

export const ResponsiveSizes: Story = {
  render: () => <ResponsiveSizesComponent />,
  parameters: {
    docs: {
      description: {
        story: 'Shows how the filter component adapts to different container widths while maintaining usability.',
      },
    },
  },
};
