import type { Meta, StoryObj } from '@storybook/react-vite';

import type { AvatarUser } from '@/components/base/avatar';
import { Avatar } from '@/components/base/avatar/avatar';

import { avatarSizes } from './utils';

const meta = {
  title: 'Avatars/Avatar variants',
  component: Avatar,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: avatarSizes,
    },
  },
} satisfies Meta<typeof Avatar>;

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
    name: 'Sarah Wilson',
    email: 'sarah.wilson@hospital.ca',
    organization: 'Toronto General',
  },
  {
    id: 'user-5',
    name: 'David Brown',
    email: 'david.brown@clinic.ca',
    organization: 'Vancouver Clinic',
  },
  {
    id: 'user-6',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@medical.ca',
    organization: 'Calgary Medical',
  },
];

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Avatar States</h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar users={[]} />
            <span className="text-sm text-muted-foreground">Unassigned</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar users={[sampleUsers[0]]} />
            <span className="text-sm text-muted-foreground">Single User</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar users={[sampleUsers[0], sampleUsers[1]]} />
            <span className="text-sm text-muted-foreground">Two Users</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar users={sampleUsers.slice(0, 3)} />
            <span className="text-sm text-muted-foreground">Three Users</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar users={sampleUsers} />
            <span className="text-sm text-muted-foreground">Six Users</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Every avatar state across all 7 sizes from the primitive.
export const Sizes: Story = {
  render: () => {
    const states: { label: string; users: AvatarUser[] }[] = [
      { label: 'Unassigned', users: [] },
      { label: 'Single User', users: [sampleUsers[0]] },
      { label: 'Two Users', users: [sampleUsers[0], sampleUsers[1]] },
      { label: 'Multiple Users', users: sampleUsers.slice(0, 4) },
    ];

    return (
      <div className="flex flex-col gap-8 p-4">
        {states.map(state => (
          <div key={state.label} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">{state.label}</h3>
            <div className="flex items-end gap-6">
              {avatarSizes.map(size => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <Avatar users={state.users} size={size} />
                  <span className="text-xs text-muted-foreground">{size}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const Unassigned: Story = {
  args: {
    users: [],
  },
};

// export const SingleUser: Story = {
//   args: {
//     users: [sampleUsers[0]],
//   },
// };

// export const TwoUsers: Story = {
//   args: {
//     users: [sampleUsers[0], sampleUsers[1]],
//   },
// };

// export const MultipleUsers: Story = {
//   args: {
//     users: sampleUsers.slice(0, 5),
//   },
// };

export const SingleNameUsers: Story = {
  args: {
    users: [
      {
        id: 'user-single-1',
        name: 'Madonna',
      },
      {
        id: 'user-single-2',
        name: 'Cher',
      },
    ],
  },
};

export const AssignmentStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Assignment Interactions</h3>
        <p className="text-sm text-muted-foreground">
          Hover over the avatars to see tooltips and user details popover.
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h4 className="font-medium">Unassigned States</h4>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar users={[]} canAssign={true} onAssignClick={() => alert('Assign clicked!')} />
                <span className="text-xs text-muted-foreground">Can Assign</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar users={[]} canAssign={false} />
                <span className="text-xs text-muted-foreground">Cannot Assign</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-medium">Assigned States (Hover for Details)</h4>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar users={[sampleUsers[0]]} size="md" />
                <span className="text-xs text-muted-foreground">Single User</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar users={[sampleUsers[0], sampleUsers[1]]} size="md" />
                <span className="text-xs text-muted-foreground">Two Users</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar users={sampleUsers.slice(0, 4)} size="md" />
                <span className="text-xs text-muted-foreground">Multiple Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TableUsageExample: Story = {
  render: () => (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Table Cell Usage Example</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Hover over avatars to see assignment tooltips and user details.
      </p>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Prescription ID</th>
              <th className="text-left p-3">Assigned Users</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-mono text-sm">666106</td>
              <td className="p-3">
                <Avatar users={[]} canAssign={true} onAssignClick={() => alert('Assign to prescription 666106')} />
              </td>
              <td className="p-3">
                <span className="text-muted-foreground">Can Assign</span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-mono text-sm">658344</td>
              <td className="p-3">
                <Avatar users={[]} canAssign={false} />
              </td>
              <td className="p-3">
                <span className="text-muted-foreground">No Assignment</span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-mono text-sm">658142</td>
              <td className="p-3">
                <Avatar users={[sampleUsers[0]]} />
              </td>
              <td className="p-3">
                <span className="text-green-600">Assigned</span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-mono text-sm">658286</td>
              <td className="p-3">
                <Avatar users={[sampleUsers[1], sampleUsers[2]]} />
              </td>
              <td className="p-3">
                <span className="text-blue-600">Collaborative</span>
              </td>
            </tr>
            <tr>
              <td className="p-3 font-mono text-sm">658290</td>
              <td className="p-3">
                <Avatar users={sampleUsers.slice(0, 4)} />
              </td>
              <td className="p-3">
                <span className="text-purple-600">Team Assignment</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
};
