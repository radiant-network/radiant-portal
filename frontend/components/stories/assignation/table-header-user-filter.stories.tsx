import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TableHeaderUserFilter } from '@/components/base/assignation/user-selection';
import { AvatarUser } from '@/components/base/avatar';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Features/Assignation/Table Header User Filter',
  component: TableHeaderUserFilter,
  args: {
    availableUsers: [],
    selectedUsers: [],
    onUsersChange: () => {},
  },
  parameters: {
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
  render: () => (
    <StorySection title="Default">
      <DefaultComponent />
    </StorySection>
  ),
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
  render: () => (
    <StorySection title="Custom placeholder">
      <CustomPlaceholderComponent />
    </StorySection>
  ),
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
  render: () => (
    <StorySection title="Small user list">
      <SmallUserListComponent />
    </StorySection>
  ),
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
    <StorySection
      title="Table Header User Filter Demo"
      description="Select users with checkboxes, then click Filter to apply. The Reset button clears all selections."
    >
      <div className="w-[400px] space-y-5">
        <TableHeaderUserFilter
          availableUsers={mockUsers}
          selectedUsers={selectedUsers}
          onUsersChange={handleUsersChange}
          defaultUser={defaultUser}
          placeholder="Filter by user..."
          isOpen={true}
        />

        {appliedFilters.length > 0 && (
          <div className="rounded-md bg-muted p-3">
            <p className="mb-2 text-sm font-semibold">Applied Filters ({appliedFilters.length}):</p>
            <ul className="ml-5 list-disc text-xs">
              {appliedFilters.map(user => (
                <li key={user.id}>
                  {user.name} {user.organization && `(${user.organization})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </StorySection>
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
  <StoryShowcase direction="row">
    <StorySection title="Narrow (250px)">
      <div className="w-[250px]">
        <TableHeaderUserFilter
          availableUsers={mockUsers.slice(0, 4)}
          selectedUsers={[]}
          onUsersChange={() => {}}
          placeholder="Search..."
          isOpen={true}
        />
      </div>
    </StorySection>
    <StorySection title="Standard (320px)">
      <div className="w-[320px]">
        <TableHeaderUserFilter
          availableUsers={mockUsers}
          selectedUsers={[mockUsers[0]]}
          onUsersChange={() => {}}
          placeholder="Search users..."
          isOpen={true}
        />
      </div>
    </StorySection>
    <StorySection title="Wide (400px)">
      <div className="w-[400px]">
        <TableHeaderUserFilter
          availableUsers={mockUsers}
          selectedUsers={[mockUsers[0], mockUsers[2]]}
          onUsersChange={() => {}}
          placeholder="Filter by assignee..."
          isOpen={true}
        />
      </div>
    </StorySection>
  </StoryShowcase>
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
